const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Message = require("./models/Message");


require('dotenv').config();


const errHandlers = require('./handlers/errorHandler');

const app = express();
const server = require('http').createServer(app);


// [APP]
app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.ENV === 'DEVELOPMENT')
    app.use(errHandlers.developmentErrors);
else
    app.use(errHandlers.productionErrors);


// [ROUTES]
app.use('/user', require('./routes/user'));
app.use('/chatroom', require('./routes/chatroom'));

app.get("/", (req, res) => {
    res.send("hello");
})


// [MONGODB]
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB connected");
    }).catch(error => console.log(error));


// [IO]
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// [IO middleware]
io.use(async(socket, next) => {
    try {
        const token = socket.handshake.query.token;
        // lấy token từ query được gửi từ App.jsx;
        const payload = await jwt.verify(token, process.env.SECRET);
        // giải mã token => user_id
        // console.log(token);
        socket.userId = payload.id;
        // lấy id của user_id gán cho userId
        next();
    } catch (err) {
        console.log(err);
    }
});


io.on('connection', (socket) => {

    console.log("User: " + socket.userId + ' connected');
    // lấy userId đã gán ở trên

    // [EVENT] listen to event sent from frontend
    socket.on('disconnect', () => {
        console.log(socket.userId + ' disconnected');
    });

    socket.on('joined_room', ({ chatroomId }) => {
        socket.join(chatroomId);
        console.log("A user join room: " + chatroomId);
    });

    socket.on('leave_room', ({ chatroomId }) => {
        socket.leave(chatroomId);
        console.log("A user left room: " + chatroomId);
    });

    socket.on("chatroom_message", async({ chatroomId, message }) => {
        if (message.trim().length > 0) {

            let userFind = await User.findOne({ _id: socket.userId });

            let newMessage = new Message({ chatroom: chatroomId, user: socket.userId, message })
                // [SEND] msg to room with id same as chatroomId
            io.to(chatroomId).emit("new_message", {
                message,
                userId: socket.userId,
                name: userFind.name
            });
            await newMessage.save();
        }
    });
})



server.listen(5000, () => {
    console.log('App is running');
})