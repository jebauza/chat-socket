// References
var ulUsers = $('#divUsuarios');
var sendForm = $('#sendForm');
var txtMessage = sendForm.find('input[name=message]');
var divChatbox = $('#divChatbox');
var titleChat = $('#title-chat');

function renderUsers(room, users) {
    ulUsers.empty();
    ulUsers.append(`<li><a href="javascript:void(0)" class="active"> Chat de <span> ${room}</span></a></li>`);

    for (let user of users) {
        if (user.id !== userCurrent.id) {
            let small = { class: 'text-success', text: 'online' };
            let span = { text: user.name };
            let img = {
                src: `assets/images/users/${user.photo}`,
                alt: 'user-img',
                class: 'img-circle',
            };

            ulUsers.append($(`<li><a data-id="${user.id}" href="javascript:void(0)"><img src="${img.src}" alt="${img.alt}" class="${img.class}"> <span>${span.text} <small class="${small.class}">${small.text}</small></span></a></li>`));
        }

    }

    ulUsers.append('<li class="p-20"></li>');
}

function renderMessages(user, msg) {
    let html = '';
    let date = new Date(msg.date);

    if (user === 'Administrator') {
        html += '<li>';
        html += '<div class="chat-content">';
        //html += `<h5>${user}</h5>`;
        html += `<div class="box bg-light-${msg.class}">${msg.text}</div>`;
        html += '</div>';
        html += `<div class="chat-time">${date.getHours() + ':' + date.getMinutes()}</div>`;
        html += `</div>`;
    } else {
        const isMyMsg = userCurrent.id === user.id;
        let img = `<div class="chat-img"><img src="assets/images/users/${user.photo}" alt="user" /></div>`;

        html += `<li class="${isMyMsg ? 'reverse' : ''}">`;
        html += isMyMsg ? '' : img;
        html += '<div class="chat-content">';
        html += `<h5>${user.name}</h5>`;
        html += `<div class="box bg-light-${isMyMsg ? 'inverse' : 'info'}">${msg.message}</div>`;
        html += '</div>';
        html += isMyMsg ? img : '';
        html += `<div class="chat-time">${date.getHours() + ':' + date.getMinutes()}</div>`;
        html += `</div>`;
    }

    divChatbox.append(html);
    scrollBottom()
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

function setTitleChat(room, user = null) {
    if (user) {
        titleChat.text('Chat Privado: ');
        titleChat.find('small').text(user.name);
    } else {
        titleChat.text('Sala de chat : ');
        titleChat.find('small').text(room);
    }
}


// Listeners
ulUsers.on('click', 'a', function() {
    let id = $(this).data('id');

    if (id) {
        txtMessage.data('to_user', id);
        txtMessage.val("");
        txtMessage.val('').focus();
    }
});

sendForm.on('submit', function(e) {
    e.preventDefault();

    if (txtMessage.val().trim()) {
        socket.emit('sendMsg', {
            message: txtMessage.val()
        }, function(msg) {
            txtMessage.val('').focus();
            renderMessages(msg.from, msg);
        });
    }
});