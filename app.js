const express = require('express');
const session = require('express-session');
const authMiddleware = require('./middleware/authmid');
const http = require('http');

const path = require('path');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'housein',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

mongoose.connect(process.env.mongodburl);
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'css')));
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'img')));
app.use(express.static(path.join(__dirname, 'js')));

const useroute = require('./router/userroutes');
const workeroute = require('./router/workerroutes');
const basicroute = require('./router/basicroutes');

app.use(useroute);
app.use(workeroute);
app.use(basicroute);


app.listen(3003, () => {
    console.log("Server running at http://localhost:3003");
});
