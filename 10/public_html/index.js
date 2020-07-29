/*
 * This file allows the user to create an account or to log in.
 * Author: Justin Nichols
 * Class: CSC337
 */

/*
 * Adds a user to the databse.
 */
function addUser() {
  $.ajax({
    url: '/add/user',
    method: 'POST',
    data: {  
      username: $('#username').val(),
      password: $('#password').val()
    },
    success: (data) => { alert(data) }
  });
}

/*
 * This function will attempt a user-login.
 */
function login() {
  $.ajax({
    url: '/login',
    method: 'POST',
    data: {
      username: $('#acct-name').val(),
      password: $('#acct-pass').val()
    },
    success: (data) => {
      if (data == "login successful") { window.location.href="/home.html"; }  
      else { $('#login-status').text('Invalid username or password.'); }
    }
  });
}
