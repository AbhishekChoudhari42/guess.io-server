const io = require("socket.io-client");
const socket = io("http://localhost:3030");

//On connecting with server
socket.on("connect", () => {
    console.log("Connected to the server with id " + socket.id);
});

//Upon server disconnection
socket.on("disconnect", () => {
    console.log("Disconnected from the server");
});

const initialState = {
    table:[
        
        {
            name:'To-Do',
            active:false,
            tasks : [] 
        },
        {
            name:'In Progress',
            active:false,
            tasks : [] 
        },
        {
            name:'Complete',
            active:false,
            tasks : [],
        }
]}

//Emit
socket.emit("update-table",initialState);