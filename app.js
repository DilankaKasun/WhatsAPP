const express = require('express');
const app = express();
const morgan = require('morgan');
const BodyParser = require('body-parser');
const chats = require('./Router/chat');
const http = require('http');
const dotenv = require("dotenv");
const qrcode = require('qrcode');
dotenv.config();
const port = process.env.PORT || 8800;
const server = http.createServer(app);

const socketIO = require("socket.io")
const io = socketIO(server);
const { Client,MessageMedia} = require('whatsapp-web.js');


const client = new Client({
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
  });

app.use(morgan('dev'));
app.use(BodyParser.urlencoded({extended:false}));
app.use(BodyParser.json());

app.use((req,res,next) =>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({});
    } 
    next();
});



app.get('/qr', (req, res) => {
    res.sendFile('index.html', {
      root: __dirname
    });
  });

//   app.use('/api',chats);

app.post('/imgMsg', async(req,res,next)=>{
    const media =await MessageMedia.fromUrl(req.body.imgURL);
    client.sendMessage(req.body.Number,media,{caption:req.body.message}).then(response =>{
        res.status(200).json({
            message:response,
            sendMessage:"Send Message"
        })
    }).catch(err =>{
        res.status(500).json({
            status:false,
            response:err
        })
    })
    
})


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

app.use((req,res,next)=>{
    const error = new Error('Not found...!');
    error.status(404);
    next(error)
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json(
        {
            error:{
                message:error.message
            }
        }
    )
})
server.listen(port, function() {
    console.log('App running on *: ' + port);
  });
