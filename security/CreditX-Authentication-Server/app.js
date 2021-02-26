const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const cors = require('cors');
const session = require('express-session');
const config = require('./config');

const app = express();
const BASE_URL = config.BASE_URL;

/*
  Express-Session library is used for the session management of the configuration panel.
 */
app.use(session({
  name: 'SID',
  resave: false,
  saveUninitialized: false,
  secret: 'afkja45353jlkjdlgj#@@%(%)#@M',
  cookie: {
    sameSite: true,
    secure: false,
  }
}));

/*
  MongoDB is used for managing persistent data. Including relevant infomration of the user.
  By default connects to the connects to the local MongoDB server.
 */
mongoose.connect('mongodb://localhost:27017/Block-Auth', {useNewUrlParser:true}).then(() => {
  console.log('\nConneted to the mongo database');
}).catch(error => {
  console.log(error);
  process.exit(-1);
})

app.use(cors({
  //origin: BASE_URL,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'x-auth-token'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/resources')));
app.use(express.static(path.join(__dirname, '/public/stylesheets')));
app.use(express.static(path.join(__dirname, '/public/javascripts')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
