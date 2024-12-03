const socket = io();

socket.on('message', (message) => {
  const messages = document.getElementById('messages');
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;
});

function sendMessage() {
  const input = document.getElementById('message-input');
  const message = input.value;
  socket.emit('message', message);
  input.value = '';
}
