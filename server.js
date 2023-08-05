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

let users = []

let userRoom = (uid) =>{
    users.forEach(user=>{
        if(user.uid == uid){
            return user.room
        }
    }) 
}

io.on('connection', (socket) => {

    console.log('a user: ' +socket.id + 'has connected');

    socket.on('join-room',(user)=>{
        
        const currentUser = {uid : socket.id , username : user.username , room:user.room}
        
        users.push(currentUser)
        console.log(currentUser,"=====currentUser")
        
        let currentRoomUsers = [] 
        
        socket.join(currentUser.room)
        console.log(socket.room,"====rooom")
        
        users.forEach(u=>{

            if(u.room === currentUser.room){
                console.log(currentUser.room)
                currentRoomUsers.push(u)
            }
        })
        console.log(currentRoomUsers,"====currentRoomUsers")

        io.to(currentUser.room).emit('currentRoomUsers',currentRoomUsers)

    })

    let clientId = socket.id

    socket.on('disconnect', () => {

    //Update all the data in the user's table:
      console.log('user ' +socket.id + ' disconnected');
        delete users[`${socket.id}`]
    });

    socket.on("update-table",(initialState)=>{
        console.log(initialState);
    })

    // emit events to client room 

    socket.on("message", (data) => {

        console.log(data,"===message")
        socket.to(data.user.room).emit('receive-msg', JSON.stringify(data))
    
    })

    socket.on("points", (data) => {
        console.log(data)
        socket.to(data.room).emit('points',data)
    })

    socket.on("startpoints", (data) => {

        socket.to(data.room).emit('startpoints',data)
    })

    socket.on("endpoints", (room) => {
        // console.log(userRoom(room),"====room user")
        socket.to(room).emit('endpoints')
    })

});




app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/client/index.html")
})

server.listen(process.env.PORT || 3030, (req,res)=>{
    console.log(`Server is running`);
})
