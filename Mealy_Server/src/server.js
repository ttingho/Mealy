require('dotenv').config();

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const overload = require('method-override');
const Http = require('http');
const api = require('./api');

const { PORT : port } = process.env;
const app = express();
const server = Http.createServer(app);

// middleware
app.use(cors());
app.use(overload());
app.use(compression());
app.use(express.json());

// api routers
app.use('/', api);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});