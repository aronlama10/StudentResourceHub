require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const AuthRouter = require('./routes/AuthRouter');
const ResourceRouter = require('./routes/ResourceRouter');
const UserRouter = require('./routes/UserRouter');

require('./models/db')
const PORT = process.env.PORT || 8000;

app.get('/ping', (req, res) => {
    res.send('PONG');
})

app.use(bodyParser.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', AuthRouter);
app.use('/resources', ResourceRouter);
app.use('/users', UserRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on ${PORT}`);
});