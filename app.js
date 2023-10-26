const express = require('express')
require('dotenv').config();
const APP_URL = process.env.APP_URL;
const PORT = process.env.PORT;

const app = express()
const router = require('./routes/app')
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

app.use(session({
    secret: process.env.SECRET_KEY, // Replace with a secret key for session encryption
    resave: false,
    saveUninitialized: false,
  }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3333' // Add other allowed origins if needed
  ];
  
  
  app.use(cors(allowedOrigins));

app.use(express.static('public'));

app.listen(PORT, () => console.log(`Server running on port ${APP_URL}`))
app.use(router)

// GET, POST, PUT, PATCH, DELETE
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/about', (req, res) => {
    res.send('Kouseki')
})