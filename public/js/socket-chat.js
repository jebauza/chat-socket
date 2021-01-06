var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room') || !params.get('name') || !params.get('room')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesario');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('joinChat', user, function(resp) {
        console.log(resp);
    });
});

socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

socket.on('newUserConnect', function(data) {
    console.log('newUserConnect: ', data);

});

socket.on('userDisconnect', function(data) {
    console.log('userDisconnect: ', data);
});

socket.on('peopleConnected', function(data) {
    console.log('peopleConnected: ', data);
});

socket.on('sendMsg', function(data) {
    console.log('sendMsg: ', data);
});

// Message Private
socket.on('privateMsg', function(data) {
    console.log('privateMsg: ', data);
});