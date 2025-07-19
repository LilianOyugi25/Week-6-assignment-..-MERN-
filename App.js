// Initialize connection
const socket = io('http://localhost:3000');

// Get DOM elements
const chatWindow = document.getElementById('chat-window');
const form = document.getElementById('message-form');
const input = document.getElementById('message-input');

// Join chat with farmer details
const farmerName = prompt('Enter your name:') || 'Anonymous';
const location = prompt('Your location (e.g. Kakamega):') || 'Western Kenya';
socket.emit('join', { 
  name: farmerName, 
  location: location 
});

// Handle messages
socket.on('new_message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `
    <strong>${data.sender}:</strong> 
    <span>${data.text}</span>
  `;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit('price_update', {
      crop: 'maize', // Default crop
      price: input.value.match(/\d+/) ? input.value.match(/\d+/)[0] : 'N/A'
    });
    input.value = '';
  }
});
