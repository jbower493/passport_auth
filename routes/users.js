const express = require('express');
const usersRouter = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const passport = require('passport');

const saltRounds = 10;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'passport_auth'
});

db.connect(() => {
  console.log('Mysql connected');
});


//login

usersRouter.get('/login', (req, res, next) => {
  res.render('login', {
    success: req.flash('message'),
    error: req.flash('error')
  });
});

usersRouter.post('/login', passport.authenticate('user', {
  successRedirect: '/dashboard',
  //successFlash: 'You successfully logged in!',
  failureRedirect: '/users/login',
  failureFlash: true
}));

//register

usersRouter.get('/register', (req, res, next) => {
  res.render('register');
});

usersRouter.get('/validate/:email', (req, res) => {
  const email = req.params.email;

  db.query('SELECT id FROM users WHERE email = ?', email, (err, results) => {
    if(err) {
      throw err;
    }
    if(results.length == 0) {
      res.send();
    } else {
      res.status(403).send('Email in use');
    }
  });
});

usersRouter.post('/register', (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if(err) {
      console.log(err);
      res.render('register', { error: 'Server error, apologies.' });
    } else {
      db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
        name,
        email,
        hash
      ], (err, result) => {
        if(err) {
          console.log(err);
          res.render('register', { error: 'Server error, apologies.' });
        } else {
          req.flash('message', 'You successfully registered and can now login.');
          res.status(201).redirect('/users/login');
        }
      });
    }
  });
});

module.exports = usersRouter;