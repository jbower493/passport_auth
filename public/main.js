//const nameField = document.getElementById('name');
const nameField = document.getElementById('reg-name');
const emailField = document.getElementById('reg-email');
const passwordField = document.getElementById('reg-password');
const password2Field = document.getElementById('reg-password2');
const submitButton = document.getElementById('reg-submit');


const checkName = () => {
  if(nameField.value === '') {
    nameField.style.border = '1px solid grey';
  } else {
    nameField.style.border = '1px solid green';
  }
};

const checkEmail = () => {
  if(emailField.value === '') {
    return emailField.style.border = '1px solid grey';
  }
  if(!emailField.value.includes('@')) {
    return emailField.style.border = '1px solid red';
  }
  const url = `/users/validate/${emailField.value}`;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if(xhr.readyState === XMLHttpRequest.DONE) {
      if(xhr.status == 200) {
        emailField.style.border = '1px solid green';
      } else {
        emailField.style.border = '1px solid red';
      }
    }
  }
  xhr.open('GET', url);
  xhr.send();
};

const checkPasswords = () => {
  // both blank
  if(passwordField.value === '' && password2Field.value === '') {
    password2Field.style.border = '1px solid grey';
    return passwordField.style.border = '1px solid grey';
  }
  // one or both are under 6 characters
  if(passwordField.value.length < 6) {
    passwordField.style.border = '1px solid red';
    password2Field.style.border = '1px solid red';
  } else if/*dont match*/(passwordField.value !== password2Field.value) {
    passwordField.style.border = '1px solid green';
    password2Field.style.border = '1px solid red';
  } else {
    passwordField.style.border = '1px solid green';
    password2Field.style.border = '1px solid green';
  }
};

const validation = (e) => {
  const errors = [];
  if(nameField.value === '' || emailField.vaule === '' || passwordField.value === '' || password2Field.value === '') {
    errors.push('Please fill in all fields.');
  }
  if(!emailField.value.includes('@')) {
    errors.push('Email address not valid.');
  }
  if(passwordField.value.length < 6) {
    errors.push('Password must be at least 6 characters.');
  }
  if(passwordField.value !== password2Field.value) {
    errors.push('Passwords do not match.');
  }
  if(errors.length > 0) {
    e.preventDefault();
    return alert(errors[0]);
  }
  const url = '/users/register';
  const data = {
    name: nameField.value,
    email: emailField.value,
    password: passwordField.value
  };
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'applictaion/json');
  xhr.send(data);
};


nameField.addEventListener('keyup', checkName);
emailField.addEventListener('keyup', checkEmail);
passwordField.addEventListener('keyup', checkPasswords);
password2Field.addEventListener('keyup', checkPasswords);
submitButton.addEventListener('click', validation);