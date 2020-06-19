const express = require('express');
const usersRouter = require('./routes/users.js');
const adminsRouter = require('./routes/admin.js');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const handlebars = require('express-handlebars');
const passportMain = require('./config/passport.js');

const app = express();

const PORT = 5000;

passportMain(passport);

const ensureAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'You need to be logged in to view this page.');
    res.redirect('/users/login');
  }
};

app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: 'dont tell anyone',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', usersRouter);
app.use('/admins', adminsRouter);


app.get('/', (req, res, next) => {
  res.render('home', { success: req.flash('message') });
});

app.get('/dashboard', ensureAuthenticated, (req, res, next) => {
  res.render('dashboard', {
    name: req.user.name
  });
});

app.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('message', 'You have logged out.');
  res.redirect('/',);
});


app.listen(PORT, () => {
  console.log('server started on port ' + PORT);
});