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

db.connect((err) => {
  if(err) {
    console.log(err);
  }
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

usersRouter.post('/register', (req, res, next) => {
  const { name, email, password, password2 } = req.body;

  if(password.length < 6) {
    return res.render('register', {
      error: 'Password must be at least 6 characters.',
      name: name,
      email: email
    });
  }
  if(password !== password2) {
    return res.render('register', {
      error: 'Passwords do not match.',
      name: name,
      email: email
    });
  }
  
  db.query('SELECT * FROM users WHERE email = ?', email, (err, result) => {
    if(err) {
      next(err);
    } else if(result.length > 0) {
      res.render('register', { error: 'Email already in use.' });
    } else {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
          next(err);
        } else {
          db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
            name,
            email,
            hash
          ], (err, result) => {
            if(err) {
              next(err);
            } else {
              req.flash('message', 'You successfully registered and can now login.');
              res.status(201).redirect('/users/login');
            }
          });
        }
      });
    }
  });
});

module.exports = usersRouter;