/*
 * This file creates the server that powers the app. It also manages the database.
 * Author: Justin Nichols
 * Class: CSC337
 */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const port = 8000;

const app = express();
const db = mongoose.connection;
const mongoDBURL = 'mongodb://localhost/ostaa';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var sessionKeys = {};
const sessionLength = 100000;

function updateSessions() {
  let now = Date.now();
  for (e in sessionKeys) {
    if (sessionKeys[e][1] < (sessionLength) {
      delete sessionKeys[e];
    }
  }
}

setInterval(updateSessions, sessionLength)

mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error.'));

var Schema = mongoose.Schema;

// Items
var ItemSchema = new Schema({
  title: String,
  desc: String,
  image: String,
  price: Number,
  avail: String 
});
var Item = mongoose.model('Item', ItemSchema);

// Users
var UserSchema = new Schema({
  username: String,
  password: String,
  listings: [Schema.Types.ObjectId],
  purchases: [Schema.Types.ObjectId] 
})
var User = mongoose.model('User', UserSchema);

const urlMod2Mod = {
  "users": User,
  "items": Item
}

app
  .use('/authenticated.html', authenticate)
  .use('/', express.static('public_html'))
  .get('/get/:monModel', (req, res) => showAllData(req, res))
  .get('/get/:userField/:username', (req, res) => showUserData(req, res))
  .get('/search/users/:keyword', (req, res) => showKeywordUsers(req, res))
  .get('/search/items/:keyword', (req, res) => showKeywordItems(req, res))
  .post('login', (req, res) => login(req, res))
  .post('/add/user', (req, res) => addUser(req)) 
  .post('/add/item/:username', (req, res) => addItem(req))
  .all('*', (req, res) => res.redirect('/'))
  .listen(port, () => console.log('App listening.'))

/*
 * This function authenticates the user.
 */
function authenticate(req, res, next) {
  if (Object.keys(req.cookies).length > 0) {
    let user = req.cookies.login.username;
    let key = req.cookies.login.key;
    if (sessionKeys[user][1] == key) { next(); }
    else { res.redirect('')}
  } 
  else { res.redirect('/'); }
}

/*
 * This function will attempt a user login
 */
function login(req, res) {
  var name = req.params.username;
  let user = {
    username: name,
    password: req.params.password
  }

  User.find(user)
    .exec((results) => { 
      if ( results.length==1 ) {
        let sessionKey = Math.floor(Math.random() * 1000);
        sessionKeys[name] = sessionKey;
        res.cookie("login", {username: u, key: sessionKey}, { maxAge: sessionLength });
        res.redirect('/public_html/home.html');
      } else {
        console.log('Invalid username or password.');
      }
    });
}

/*
 * This function can provide all user-data or all item-data in the database.
 */
function showAllData(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  let MonModel = urlMod2Mod[req.params.monModel];
  MonModel.find({})
    .exec((error, results) => res.send(JSON.stringify(results, null, 4)));
}

/*
 * This function can provide all listings or all purchases from a given user.
 */
function showUserData(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  User.find({ username: req.params.username })
    .exec((error, results) => {
      if (results.length < 1) {
        res.send('User not found');
        return;
      }

      let user = results[0];
      switch(req.params.userField) {
        case "listings":
          res.send(JSON.stringify(user.listings, null, 4));
          break;
        case "purchases":
          res.send(JSON.stringify(user.purchases, null, 4));
        default:
          res.send('Invalid URL.');
      }
    })
}

/*
 * This function provides all users whose name contains a given keyword.
 */
function showKeywordUsers(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  let keyword = new RegExp(decodeURIComponent(req.params.keyword));
  User.find({ username: keyword })
    .exec((error, results) => res.send(JSON.stringify(results, null, 4)));
}

/*
 * This function provides all items whose name contains a given keyword.
 */
function showKeywordItems(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  let keyword = new RegExp(decodeURIComponent(req.params.keyword));
  Item.find({ desc: keyword })
    .exec((error, results) => res.send(JSON.stringify(results, null, 4)));
}

/*
 * This function adds a user account to the database.
 * @param: req. The http request containing the account info.
 */
function addUser(req) {  
  let userObj = req.body;
  User.find({ username: userObj.username })
  .exec((error, results) => {
    if (results.length == 0) {
      user = new User({ username: userObj.username, password: userObj.password });
      user.save((err) => { if (err) { console.log('Could not save user.') }});
      console.log("Account created.");
    } else {
      console.log('Username already exists.');  
    }     
  });
}

/*
 * This function adds an item to the database.
 * @param: req. The http request containing the account info.
 */
function addItem(req) { 
  let itemObj = req.body;
  User.find({ username: req.params.username })
    .exec((error, results) => {
      if (results.length == 1) {
        // creating item
        item = new Item({ 
          title: itemObj.title,
          desc: itemObj.desc,
          image: itemObj.image,
          price: itemObj.price,
          avail: itemObj.avail 
        });
        item.save((err) => { if (err) { console.log('Could not save item.') }});
       
        // adding item to user's listings
        let user = results[0];
        user.listings.push(item._id);
        user.save()
        console.log('Item added.'); 
      } else {
        console.log('Could not find seller.');
      }
    });
}
