import React, { useEffect, useState } from "react";
import io from "socket.io-client";

//importing local assets
import MobileIcon from './assets/img/smartphone.png';
import LaptopIcon from './assets/img/laptop.png';
import './css/clipboard.css';
import Navbar from "./navbar";

const electron = window.require("electron");
const { ipcRenderer } = electron;

//constants
const { COPIED_TEXT } = require("../shared/constants");

//etablishes a socket connection to the server 
const serverURL = process.env.REACT_APP_SERVER_URL;
let socket = io.connect(serverURL);


const ClipB = () => {

    //stores the user info
    const [user, setUser] = useState({
        id: '',
        email: '',
        name: '',
        hasInfo: false
    });

    //array of all the clipboard element that are copied
    const [copiedMsg, setCopiedMsg] = useState('');

    //handle start and stop service
    const [start, setStart] = useState(false);
    const [countBtn, setCountBtn] = useState(0);

    //array of objects of connected devices
    const [remoteDevices, setRemoteDevices] = useState([]);

    //async localstorage
    const asyncLocalStorage = {
        async setItem(key, value) {
            await null;
            return localStorage.setItem(key, value);
        },
        async getItem(key) {
            await null;
            return localStorage.getItem(key);
        }
    };

    //fetches user data from the server using api call
    const getUser = async () => {
        try {
            const userURL = serverURL + '/api/user';

            //fetches the server and waits for response
            const response = await fetch(userURL, {
                method: 'GET',
                credentials: 'include' //imp
            });

            //fetches the body after getting the response
            const body = await response.json();

            //extracts different details from body
            const { _id, email, name } = body;

            //sets user Info
            setUser((prevVal) => ({ ...prevVal, id: _id, name, email, hasInfo: true }));


            //stores user data in local storage if it is empty
            // if (localStorage.getItem("name") === null) {
            //     await asyncLocalStorage.setItem("name", name);
            //     await asyncLocalStorage.setItem("id", _id);
            // }


            console.log(body);

            //count number of clicks to button
            setCountBtn(prevVal => prevVal + 1);

        } catch (error) { //if error log the error
            if (error)
                console.log("Error fetching user info: ", error);
        }
    }

    //event listener on userInfo
    useEffect(() => {
        //create a connection among devices with same account by joining same room socket   
        if (user.hasInfo === true) {
            if (countBtn === 1) {
                console.log(countBtn);
                console.log("userInfo:", user);

                //send the device, user and socket info 
                socket.emit('join', { id: user.id, isMobile: false, device_id: socket.id });
            }
            else {
                console.log('socket connected');

                socket.connect();

                //problem socket.connect() is an async fuction the socket.id is not send with socket.emit and also it doesn't return a promise thus i can't use then & catch or await
                //send the device, user and socket info 
                setTimeout(() => {
                    socket.emit('join', { id: user.id, isMobile: false, device_id: socket.id });
                }, 1000);
            }
        }
    }, [user, countBtn]);


    //event listener on setCopiedArr
    useEffect(() => {
        //emit message only if there is something copied and also when userInfo is retrieved
        if (copiedMsg !== '') {
            console.log(copiedMsg);

            //checks if user info is retrieved i.e. socket is connected 
            if (user.hasInfo === true) {
                socket.emit('copied_message', { message: copiedMsg, id: user.id }); //send the messages to devices on same id
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [copiedMsg]);


    //react event listener listens for change in socket
    useEffect(() => {
        //only recieve copied text from synced devices
        socket.on("recieve_copied_message", (data) => {
            console.log("This is copied message: ", data);

            //send the copied text from other devices and sent to main process
            ipcRenderer.send("remote_copied_text", { message: data.message });
        });


        //recieve the details of connected devices
        socket.on("connected_devices", async (data) => {
            console.log("data of devices recieved", data);

            //pushing the details of each device connected to the socket in array
            setRemoteDevices(prevVal => [...prevVal, data]);

            const user_id = await asyncLocalStorage.getItem("id");
            console.log(user_id);

            //sending personal device detail to the newly connected device to know about past socket connection
            socket.emit("existing_connection", { id: user_id, isMobile: false, device_id: socket.id });
        });

        //receives data about already connected devices to the socket
        socket.on("existing_connected_devices", (data) => {
            // setRemoteDevices()
            console.log("existing connection:", data);

            //add already connected device to socket to connected_devices array if they don't exist
            setRemoteDevices(prevVal => {
                //flag to check if device already exist in remote device array
                let isPresent = false;

                prevVal.forEach(device => {
                    if (device.device_id === data.device_id)
                        isPresent = true;
                });

                //if present in the array then return same array if not then add into array
                if (isPresent)
                    return prevVal;
                else {
                    return [...prevVal, data];
                }
            })
        })


        //recieve the device id of disconnected device
        socket.on("disconnect_remote_device", (data) => {
            console.log("disconnect_remote_device: ", data.device_id);

            //it filters the element with device_id same as socket_id then return the array remoteDevices
            setRemoteDevices(prevVal => prevVal.filter(device => device.device_id !== data.device_id));

        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    //recieves message from the main process
    ipcRenderer.on(COPIED_TEXT, (evt, message) => {
        //set the copiedMsg to the latest copied text via main process 
        setCopiedMsg(message);
    });


    //stops the service if active
    const stopService = () => {
        //remove this device when disconnected from other remote device    
        socket.emit("disconnect_device", { id: user.id, device_id: socket.id });

        //it filters the element with device_id same as socket_id then return the array remoteDevices
        setRemoteDevices(prevVal => prevVal.filter(device => device.device_id === socket.id));

        //closes socket connection
        socket.close();
    }

    //test only
    useEffect(() => {
        console.log("if the state remote devices change: ", remoteDevices);
    }, [remoteDevices]);


    //handle when the service starts
    const handleService = () => {
        if (!start) {
            getUser();
            setStart(true);
            console.log('service started');
        } else {
            stopService();
            setStart(false);
            console.log('service stopped');
        }
    }


    return (<div className="background">
        <Navbar />
        <div className="clipboard-container">
            <button type="submit" className="btns" onClick={handleService}>{start === false ? 'Start Service' : 'Stop Service'}</button>
            {/* for dev testing
        <>
            <button type="submit" onClick={getUser}>Get User</button>
            <h1>{user.id}</h1>
            <h1>{user.name}</h1>
            <h1>{user.email}</h1>
        </> */}

            <h1>Connected Devices</h1>
            <div className="connected-devices">
                {remoteDevices.length !== undefined ? remoteDevices.map((element, idx) => {

                    //connected device details
                    const id = element.device_id;
                    const isMobile = element.isMobile;
                    const device = isMobile ? "Mobile/Tablet" : "Laptop/Desktop";
                    const src = isMobile ? MobileIcon : LaptopIcon;

                    return (<div className="device" id={id} key={idx}>
                        <img src={src} alt={device} />
                        <p>{device}</p>
                    </div>);
                }) : null
                }
            </div>
        </div>
    </div>)
}

export default ClipB;


