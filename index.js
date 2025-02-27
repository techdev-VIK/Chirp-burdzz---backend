const express = require('express');

const mongoose = require('mongoose');

const http = require('http');

const cors = require('cors');

const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');

const {Server} = require('socket.io');

const ChirpMessages = require('./models/Messages');

const ChirpUser = require('./models/User');


dotenv.config();



const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());

app.use(express.json());


mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((error) => console.error(error));


app.use('/auth', authRoutes);


// console.log(require('crypto').randomBytes(32).toString('hex'));

// socket io logic

io.on("connection", (socket) => {
    console.log('User connected', socket.id);

    socket.on("send_message", async(data) => {
        const {sender, receiver, message} = data;

        const newMessage = new ChirpMessages({sender, receiver, message});
        await newMessage.save();
    })

    socket.broadcast.emit('receive_message', data);

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id)
    })
})


app.get('/messages', async(req, res) => {
    const {sender, receiver} = req.query;

    try {
        const messages = await ChirpMessages.find({
            $or: [
                {sender, receiver}, {sender: receiver, receiver: sender}
            ]
        }).sort({createdAt: 1});

        res.json(messages);
    } catch (error) {
        res.status(500).json({message: "Error fetching data"})
    }
})

app.get('/users', async(req,res) => {
    const {currentUser} = req.query;

    try {
        const users = await ChirpUser.find({username: {$ne: currentUser}});
        res.json(users);
    } catch (error) {
        res.status(500).json({message: 'Error fetching users.'})
    }
})


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
