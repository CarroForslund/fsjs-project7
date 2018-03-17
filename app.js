//VARIABLE DECLARATION
const express = require('express'); //Require express to be able to use it
const bodyParser = require('body-parser');
const app = express();  // Express app declaration

const Twit = require('twit'); //Require Twit to be able to use it
const config = require('./config');
const T = new Twit(config);
const user = {};

//APP (EXPRESS) SETTINGS
app.set('view engine', 'pug'); //Set up the engine template to use Pug
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {

  // Get the 5 most recent tweets
  T.get('statuses/user_timeline', { screen_name: user.name, count: 5 },  function (err, data, res) {

    if(err){
      console.log('Error: ', err);
    }
    else {
      user.tweets = data;
    }
  });
  next();
});

app.use((req, res, next) => {
  // Get my 5 latest friends (people I follow)
  T.get('friends/list', { screen_name: user.name, count: 5 },  function (err, data, res) {

    if(err){
      console.log('Error: ', err);
    }
    else {
      user.friends = data;
      console.log(user.friends);
    }

  });
  next();
});

app.use((req, res, next) => {
  // Get the 5 latest private messages in my last private conversation
  T.get('direct_messages/events/list', { screen_name: user.name, count: 5 },  function (err, data, response) {

    if(err){
      console.log('Error: ', err);
    }
    else {
      user.messages = data.events;
      // console.log(user.messages.message_create.message_data);
    }

  });

  next();

});

//Declare a route. The get methos takes 2 parameters. The route and a cb function
//The send methos sends a string to the client
app.get('/', (req, res) => {
  res.locals.user = user;
  res.render('index');
});

app.post('/', (req, res) => {
  T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
    if(err){
      console.log('Error: ', err);
    }
    else {
      console.log(data);
      res.locals.user = user;
      res.render('index');
    }
  })

});

app.use((req, res, next) => {
  const err = new Error('The Page Does Not Exist');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});

app.listen(3000, () => {
  console.log('The application is running on localhost:3000');
}); // The app listens to port 3000 (localhost)



// app.use((req, res, next) => {
//   // Twit has promise support; you can use the callback API,
//   // promise API, or both at the same time.
//   T.get('account/verify_credentials', { skip_status: true })
//     .catch(function (err) {
//       console.log('caught error', err.stack)
//     })
//     .then(function (result) {
//       // `result` is an Object with keys "data" and "resp".
//       // `data` and `resp` are the same objects as the ones passed
//       // to the callback.
//       // See https://github.com/ttezel/twit#tgetpath-params-callback
//       // for details.
//       const data = result.data;
//       // console.log(data);
//       user.id = data.id;
//       user.name = data.screen_name; //Get profile name
//       user.image = data.profile_image_url; //Get profile image
//       user.background = data.profile_banner_url; //Get background image
//
//       // Get the 5 most recent tweets
//       T.get('statuses/user_timeline', { screen_name: user.name, count: 5 },  function (err, data, res) {
//         user.tweets = data;
//       });
//
//       T.get('friends/list', { screen_name: user.name, count: 5 },  function (err, data, res) {
//
//         if(err){
//           console.log('Error: ', err);
//         }
//         else {
//           user.friends = data;
//           // console.log(user.friends);
//         }
//
//       });
//
//       // Get the 5 latest private messages in my last private conversation
//       T.get('direct_messages/events/list', { screen_name: user.name, count: 5 },  function (err, data, response) {
//         console.log(data);
//         user.messages = data.event;
//
//         // console.log(user.messages[0].message_create.message_data);
//       });
//
//     });
//     next();
// });
