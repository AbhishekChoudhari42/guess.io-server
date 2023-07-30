require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");

// C:\Users\abhis\OneDrive\Desktop\REACT\guess.io\server\Project-management-app\client

const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173/",
}));

//Socket.io
const http = require("http");


const server = http.createServer(app);
const io = require("socket.io")(server,{
    cors: true, 
    origins: ["http://localhost:5173/"]
})


app.use(bodyParser.urlencoded({ extended: true }));

let users = {}

io.on('connection', (socket) => {

    console.log('a user: ' +socket.id + 'has connected');

    let clientId = socket.id
    
    socket.on('disconnect', () => {

    //Update all the data in the user's table:
      console.log('user ' +socket.id + ' disconnected');
        delete users[`${socket.id}`]
    });

    socket.on("update-table",(initialState)=>{
        console.log(initialState);
    })

    socket.on("points", (data) => {
        socket.broadcast.emit('points',data)
    })

    socket.on("startpoints", (data) => {

        socket.broadcast.emit('startpoints',data)
    })

    socket.on("endpoints", () => {

        socket.broadcast.emit('endpoints')
    })

});




app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/client/index.html")
})

server.listen(process.env.PORT || 3030, (req,res)=>{
    console.log(`Server is running`);
})
