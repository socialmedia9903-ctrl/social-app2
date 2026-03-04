
require("dotenv").config();
const express=require("express");
const http=require("http");
const {Server}=require("socket.io");
const cors=require("cors");
const connectDB=require("./config/db");
const authRoutes=require("./routes/auth");

connectDB();

const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use(express.static("public"));

const server=http.createServer(app);
const io=new Server(server);

let users={};

io.on("connection",(socket)=>{
socket.on("join",(username)=>{
users[username]=socket.id;
socket.username=username;
io.emit("online-users",Object.keys(users));
});

socket.on("private-message",(data)=>{
if(users[data.to]){
io.to(users[data.to]).emit("private-message",data);
}
});

socket.on("disconnect",()=>{
delete users[socket.username];
io.emit("online-users",Object.keys(users));
});
});

server.listen(process.env.PORT,()=>console.log("Server Running"));
