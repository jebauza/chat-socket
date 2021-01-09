var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room') || !params.get('name') || !params.get('room')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesario');
}

var userCurrent = {
    name: params.get('name'),
    room: params.get('room'),
    photo: `${Math.floor(Math.random() * (8 - 1)) + 1}.jpg`
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('joinChat', userCurrent, function(resp) {
        userCurrent = resp.user;
        renderUsers(userCurrent.room, resp.peopleConnected);
        setTitleChat(userCurrent.room);
    });
});

socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

socket.on('newUserConnect', function(data) {
    let msg = {
        class: 'success',
        text: data.message,
        date: new Date().getTime()
    }
    renderMessages(data.user, msg);
});

socket.on('userDisconnect', function(data) {
    let msg = {
        class: 'danger',
        text: data.message,
        date: new Date().getTime()
    }
    renderMessages(data.user, msg);
});

socket.on('peopleConnected', function(data) {
    renderUsers(userCurrent.room, data);
});

socket.on('sendMsg', function(msg) {
    renderMessages(msg.from, msg);
});

// Message Private
socket.on('privateMsg', function(msg) {
    renderMessages(msg.from, msg);
});