const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'passport_auth'
});


const passportMain = (passport) => {

  passport.serializeUser(function(user, done) {
    if(user.role == 'admin') {
      console.log('Its an admin');
    } else {
      console.log('Its a user');
    }
    done(null, {
      id: user.id,
      role: user.role
    });
  });
  
  passport.deserializeUser(function(object, done) {
    if(object.role == 'user') {
      console.log('Queried users');
      db.query('SELECT * FROM users WHERE id = ?', object.id, (err, result) => {
        done(err, result[0]);
      });
    } else {
      console.log('Queried admins');
      db.query('SELECT * FROM admins WHERE id = ?', object.id, (err, result) => {
        done(err, result[0]);
      });
    }
  });

  passport.use('user', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 
    function(email, password, done) {
      console.log('using user login');
      db.query('SELECT * FROM users WHERE email = ?', email, function(err, result) {
        if(err) {
          return done(err);
        }
        if(result.length == 0) {
          return done(null, false, { message: 'User not found!' });
        }
        bcrypt.compare(password, result[0].password, function(err, matches) {
          if(err) {
            return done(err);
          }
          if(matches) {
            return done(null, result[0]);
          } else {
            return done(null, false, { message: 'Incorrect password!' });
          }
        });
  
      });
    }
  ));

  passport.use('admin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 
    function(email, password, done) {
      console.log('using admin login');
      db.query('SELECT * FROM admins WHERE email = ?', email, function(err, result) {
        if(err) {
          return done(err);
        }
        if(result.length == 0) {
          return done(null, false, { message: 'User not found!' });
        }
        if(password == result[0].password) {
          return done(null, result[0]);
        } else {
          return done(null, false, { message: 'Incorrect password!' });
        }
      });
    }
  ));

};


module.exports = passportMain;