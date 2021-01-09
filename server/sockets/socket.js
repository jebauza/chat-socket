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
        let newUser = people.addUser(client.id, user.name, user.room, user.photo);
        let peopleConnected = people.getUsers(newUser.room);

        callback({ user: newUser, peopleConnected });

        client.broadcast.to(newUser.room).emit('newUserConnect', {
            user: 'Administrator',
            message: `${newUser.name} se unio al chat`
        });

        client.broadcast.to(newUser.room).emit('peopleConnected', people.getUsers(newUser.room));
    });

    // Desconecta el usuario
    client.on('disconnect', () => {
        let userDelete = people.deleteUser(client.id);

        client.broadcast.to(userDelete.room).emit('userDisconnect', {
            user: 'Administrator',
            message: `${userDelete.name} abandono chat`
        });
        client.broadcast.to(userDelete.room).emit('peopleConnected', people.getUsers(userDelete.room));
    });

    client.on('sendMsg', (data, callback) => {
        let user = people.getUser(client.id);
        let newMsgRoom = createMsg(user, user.room, data.message);
        client.broadcast.to(user.room).emit('sendMsg', newMsgRoom);

        callback(newMsgRoom);
    });

    client.on('privateMsg', (data, callback) => {
        let userfrom = people.getUser(client.id);
        let userTo = people.getUser(data.userToId);

        let newMsgPrivate = createMsg(userfrom, userTo, data.message);
        client.broadcast.to(userTo.id).emit('privateMsg', newMsgPrivate);

        callback(newMsgPrivate);
    });

});