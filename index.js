const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const socketIO = require("socket.io")
const qrcode = require('qrcode');
const http = require('http');
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
}
});

app.get('/', (req, res) => {
    res.sendFile('index.html', {
      root: __dirname
    });
  });

  


client.initialize();


// Socket IO
io.on('connection', function(socket) {
    socket.emit('message', 'Connecting...');
    client.on('qr', qr => {
      qrcode.toDataURL(qr,(err,url)=>{
        socket.emit('qr',url);
        socket.emit('message', 'QR Ready....!');
      })
  });
  client.on('ready', () => {
    socket.emit('message', 'WhathsApp Ready....!');
});
});
server.listen(port, function() {
    console.log('App running on *: ' + port);
  });



