import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/signup.css'
import GoogleIcon from './assets/img/google.png';
import GithubIcon from './assets/img/github.png';


const electron = window.require("electron");
const { ipcRenderer } = electron;


const Signup = () => {
    //assigns the useNavigate hook to navigate to navigate to different pages
    const navigate = useNavigate();

    //check if url is login page or not
    // const currentURL = window.location.href;       // dev test
    // const isLogin = currentURL.includes("login"); //dev test
    const [isLogin, setIsLogin] = useState(false);

    //stores server url
    const serverURL = process.env.REACT_APP_SERVER_URL;
    // console.log(serverURL);

    //react state for form input values
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    //stores the response from the server
    const [response, setResponse] = useState({
        statusCode: '',
        body: ''
    });

    //display the response from the server
    useEffect(() => {
        console.log(response);
        if (response.statusCode === 200) {
            fetch(serverURL + '/api/user', {
                method: 'GET',
                credentials: 'include' //imp
            })
                .then(response => response.json())
                .then(async data => {
                    console.log("This is data: ", data);
                    const { name, _id, email } = data;

                    //stores user data in local storage
                    if (localStorage.getItem('name') == null) {
                        console.log("localStorage is empty");
                        localStorage.setItem("name", name);
                        localStorage.setItem("id", _id);
                        localStorage.setItem("email", email);
                    }

                    //store user data in app using electron store
                    ipcRenderer.send("user-data", { name, id: _id }); //remove this in renderer and main

                    //navigate to clipboard page after storing user data
                    navigate('/clipboard');
                });


        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, response]);


    //checks if the user is already logged in
    // const userURL = serverURL + '/api/user';

    // //fetches the server and waits for response
    // fetch(userURL, {
    //     method: 'GET',
    //     credentials: 'include' //imp
    // }).then(response => {
    //     if (response.status === 200) {
    //         navigate('/clipboard');
    //     } else {
    //         navigate('/');
    //     }
    // });


    //handle change when there is an input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevVal) => { return ({ ...prevVal, [name]: value }) })
    }

    //handles when the submit button is clicked
    const handleForm = (event) => {
        //prevents the form from reloading
        event.preventDefault();
        console.log("i have been clicked");

        //api to post the form data to the server
        const url = isLogin ? 'login' : 'signup';
        const postURL = serverURL + '/api/' + url;

        //posts the data to the server and intercept the response
        fetch(postURL, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            //take the response and sets the value of status code
            .then(response => {
                setResponse(prevVal => ({ ...prevVal, statusCode: response.status }));
                return response.json();
            })
            //takes the data from the response.json() stores in response state //also this is not .then from fetch but of then(response) fn
            .then(data => {
                setResponse(prevVal => ({ ...prevVal, body: data.message }));
            })
            .catch(error => console.error(error));
    }

    //handle Login click
    const handleLogin = (e) => {
        e.preventDefault();
        setIsLogin(true);
    }

    //handle signup click
    const handleSignup = (e) => {
        e.preventDefault();
        setIsLogin(false);
    }

    //handle google login
    const googleLogin = () => {
        window.open(serverURL + '/api/auth/google', "_self");
    }

    //handle github login
    const githubLogin = () => {
        window.open(serverURL + '/api/auth/github', "_self");
    }

    return (<>
        <div className="container">
            {/* side img */}
            <div className="overlay">
                <div className="img">
                </div>
                <div className="form">
                    {/* top part of form with name email and password */}
                    <div className="form-top">
                        <form onSubmit={handleForm}>
                            <div className="nested-form">
                                {/* to show login and ignore name when on login page */}
                                {isLogin ? <h2>Login into Account</h2> : <>
                                    <h2>Create an Account</h2>
                                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                                </>}

                                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                                <button className="btns" type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>

                                {isLogin ? <>
                                    <p className="login-text">Don't have an account? <a href="/#/" onClick={handleSignup}>Signup</a></p></>
                                    :
                                    <><p className="login-text">Already have an account? <a href="/#/" onClick={handleLogin}>Login</a></p>
                                    </>
                                }
                                {response.statusCode === 401 ? <p className="error">{response.body}</p> : null}
                            </div>
                        </form>
                    </div>
                    {/* currently working on fixing on running google and github in electron chromium instance */}
                    {/* <h4>Continue with</h4> */}
                    {/* top part of form to signup with google and Github */}
                    {/* <div className="form-bottom">
                        <button className="google" onClick={googleLogin}>
                            <img src={GoogleIcon} className="img-icon btns" alt='' />
                        </button>
                        <p>- or -</p>
                        <button className="github" onClick={githubLogin}>
                            <img src={GithubIcon} className="img-icon btns" alt="" />
                        </button>
                    </div> */}

                </div>
            </div >
        </div >
    </>)
}

export default Signup;