const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');


dotenv.config();



const app = express();

app.use(cors());

app.use(express.json());


mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((error) => console.error(error));


app.use('/auth', authRoutes);


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
