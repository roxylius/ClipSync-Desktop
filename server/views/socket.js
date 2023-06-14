const { Server } = require('socket.io');

const handleSocket = (server) => {
    const io = new Server(server, { cors: { origin: '*' } });

    io.on('connection', (socket) => {
        console.log('New connection: ', socket.id);

        socket.on('join', (data) => {
            console.log(data);
            socket.join(data.id);
        });

        socket.on('copied_message', (data) => {
            console.log(data);
            socket.emit('recieve_copied_message', { message: 'hello' });
        })
    });

};

module.exports = handleSocket;