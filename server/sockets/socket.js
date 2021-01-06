const { io } = require('../server');
const { People } = require('../class/people');
const { createMsg } = require('../utility/utility');

const people = new People();


io.on('connection', (client) => {

    // Usuario se conecta
    client.on('joinChat', (user, callback) => {
        if (!user.name || !user.room) {
            return callback({
                error: true,
                message: 'El nombre/sala es requerido'
            });
        }

        client.join(user.room);
        let newUser = people.addUser(client.id, user.name, user.room);
        let peopleConnected = people.getUsers(newUser.room);

        callback(newUser);

        client.broadcast.to(newUser.room).emit('newUserConnect', {
            user: newUser,
            peopleConnected,
            message: `${newUser.name} se unio al chat chat`
        });

        client.broadcast.to(newUser.room).emit('peopleConnected', peopleConnected);
    });

    // Desconecta el usuario
    client.on('disconnect', () => {
        let userDelete = people.deleteUser(client.id);

        client.broadcast.to(userDelete.room).emit('userDisconnect', createMsg('Admin', `${userDelete.name} abandono chat`));
        client.broadcast.to(userDelete.room).emit('peopleConnected', people.getUsers(userDelete.room));
    });

    client.on('sendMsg', (data) => {
        let user = people.getUser(client.id);
        let newMsg = createMsg(user.name, data.message);
        client.broadcast.to(user.room).emit('sendMsg', newMsg);
    });

    client.on('privateMsg', (data) => {
        let userfrom = people.getUser(client.id);
        let userTo = people.getUser(data.userToId);

        let newMsg = createMsg(userfrom.name, data.message);
        client.broadcast.to(userTo.id).emit('sendMsg', newMsg);
    });

});