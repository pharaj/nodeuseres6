const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//setup express
const app = express();

//connecting to mongodb
mongoose.connect('mongodb://pharaj:abc123@ds129454.mlab.com:29454/mydb', { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//initialize routes
app.use('/user', require('./routes/user'));

//error handler middleware
app.use((err, req, res, next) => {
    res.status(422).send(err);
});


app.listen(4000, () => {
    console.log('now listening on port 4000');
});