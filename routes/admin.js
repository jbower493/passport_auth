const express = require('express');
const adminsRouter = express.Router();
const mysql = require('mysql');
const passport = require('passport');
//const { passportAdmin } = require('../config/passport.js');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'passport_auth'
});

db.connect((err) => {
  if(err) {
    console.log(err);
  }
  console.log('Mysql connected');
});


adminsRouter.get('/login', (req, res, next) => {
  res.render('adminlogin', {
    success: req.flash('message'),
    error: req.flash('error')
  });
});

adminsRouter.post('/login', passport.authenticate('admin', {
  successRedirect: '/dashboard',
  //successFlash: 'You successfully logged in!',
  failureRedirect: '/users/login',
  failureFlash: true
}));


module.exports = adminsRouter;