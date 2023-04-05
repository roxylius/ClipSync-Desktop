const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const port = 3000 || process.env.PORT;

app.get('/', (req, res) => {
    res.send("hello world");
});

app.post('/api/login', (req, res) => {
    const { email, pass } = req.body;
});

app.post('/api/signup', (req, res) => {
    const { name, email, pass } = req.body;
});

app.listen(port, () => console.log("The server is listening on port:" + port, "..."));