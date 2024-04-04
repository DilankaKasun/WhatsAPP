const { Client } = require('whatsapp-web.js');
const express = require('express');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const path = require('path');

const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const currentPath = __dirname; // Get the current directory path

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(currentPath, 'public')));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(currentPath, 'public') });
});

client.initialize();

// Socket IO
io.on('connection', function(socket) {
  socket.emit('message', 'Connecting...');
  client.on('qr', qr => {
    qrcode.toDataURL(qr, (err, url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return;
      }
      socket.emit('qr', url);
      socket.emit('message', 'QR Ready....!');
    });
  });
  client.on('ready', () => {
    socket.emit('message', 'WhatsApp Ready....!');
  });
});

server.listen(port, () => {
  console.log('Current path:', currentPath); // Display the current path
  console.log('App running on port ' + port);

});
