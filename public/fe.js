// 1. connect to your socket
const socket = io.connect('http://alvin.garagescript.org/');

let name = prompt('what is your username?');

socket.on('connect', () => {
  // 2. on connect, emit your name to your server
  socket.emit('presence', name);
});

let users = {};

// 3. Bind to initial data to get all users and messages
// call renderUsers(users), and renderMessages(messages) to load UI
socket.on('chat', (chat) => {
  users = chat.users;
  renderUsers(users);
  renderMessages(chat.messages);
});

// 4. Bind to event (when new user joins), then renderUsers(users);
socket.on('users', (newUsers) => {
  users = newUsers;
  renderUsers(users);
});

// 5. Bind to event (when new message is received ), then call createMessage({name, message});
socket.on('message', ({ userId, message }) => {
  createMessage({name: users[userId].name, message});
});

const submit = (v) => {
  if(!name) return;
  // 6. submit is called when user hits enter. Emit an event to server with the message
  socket.emit('message', { message: v});
  createMessage({name, message: v});
};

/* 
 * HELPER functions for rendering UI below
*/
const chatContainer = document.getElementsByClassName('chatContainer')[0];

const renderUsers = (users) => {
  const userListContainer = document.getElementById('userListContainer');
  userListContainer.innerHTML = Object.values(users).reduce((acc, user) => {
    return `${acc} <div> ${user.name} </div>`;
  }, '');
};

const renderMessages = (messages) => {
  chatContainer.innerHTML = '';
  messages.forEach( ({userId, message}) => {
    const u = users[userId] || {name: "Anon"};
    createMessage({name: u.name, message});
  });
  chats.scrollTop = chats.scrollHeight;
};

const createMessage = ({name, message}) => {
  const ct = document.createElement('div');
  ct.className = 'chat';
  ct.innerHTML = `
<span class="user">${name}: </span>
<span class="message">${message}</span>
  `;
  chatContainer.appendChild(ct);
  chats.scrollTop = chats.scrollHeight;
};

input.focus();
input.onkeyup = (e) => {
  if(e.keyCode === 13) {
    const v = e.target.value;
    submit(v);
    input.value = '';
  };
};

