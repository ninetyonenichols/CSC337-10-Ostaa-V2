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
    }
  });
}

/*
 * This function will attempt a user-login.
 */
function login() {
  $.ajax({
    url: '/login',
    method: 'POST',
    data {
      username: $('#acct-name').val() ,
      password: $('#acct-pass').val()
    }
  });
}
