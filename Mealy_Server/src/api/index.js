const api = require('express').Router();

const authMiddle = require('../middleware/auth');

const auth = require('./auth');
const meal = require('./meal');
const user = require('./member.ctrl');
const ticket = require('./ticket');

api.use('/auth', auth);
api.use('/meal', meal);
api.use('/user', user);
api.use('/ticket', authMiddle, ticket);

module.exports = api;
