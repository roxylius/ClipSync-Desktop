const { Server } = require('socket.io');

const handleSocket = (server) => {
    const io = new Server(server, { cors: { origin: '*' } });

    io.on('connection', (socket) => {
        //when a new socket connection is establish.
        console.log('New connection: ', socket.id);

        //handle joins request made in socket
        socket.on('join', (data) => {
            console.log('device connected: ', data);
            socket.join(data.id);

            //emits recently connected device data to other connected devices
            socket.to(data.id).emit('connected_devices', data);
        });

        //send existing connection device details to newly connected device
        socket.on("existing_connection", (data) => {
            console.log("these are the existing connections: ", data);
            socket.to(data.id).emit("existing_connected_devices", data);
        });

        // receives copied message from remote client
        socket.on('copied_message', (data) => {
            console.log(data);
            socket.to(data.id).emit('recieve_copied_message', { message: data.message });
        });


        //receives device_id when socket connection is about to closed to remove device from connecteddevices 
        socket.on('disconnect_device', (data) => {
            console.log("device disconnected", data)
            socket.to(data.id).emit('disconnect_remote_device', data);
        });

        //when socket connection is closed
        socket.on('disconnect', (data) => {
            console.log("Device disconnected!");
        });
    });

};

module.exports = handleSocket;