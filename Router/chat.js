const { response } = require("express");
const express = require("express");
const router = express.Router();
const {  MessageMedia} = require('whatsapp-web.js');

router.get('/chat', (req,res,next)=>{
    console.log(__dirname)
})

router.post('/IMGmessage', async(req,res,next)=>{
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

module.exports = router;
