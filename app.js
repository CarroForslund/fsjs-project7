//VARIABLE DECLARATION
const express = require('express'); //Require express to be able to use it
const bodyParser = require('body-parser');
const app = express();  // Express app declaration

const Twit = require('twit'); //Require Twit to be able to use it
const config = require('./config');
const T = new Twit(config);
const user = {};
const message = {}
let messageData = null;

//APP (EXPRESS) SETTINGS
app.use(bodyParser.urlencoded({ extended: false })); // To be able to read forms body data
app.set('view engine', 'pug'); //Set up the engine template to use Pug
app.use(express.static('public'));

//convert date to timestamp
function getTimestamp(time){
  const date = new Date(time);
  return date.getTime();
}

//Declare a route. The get methos takes 2 parameters. The route and a cb function
//The send methos sends a string to the client
app.get('/', (req, res) => {

  T.get('account/verify_credentials', { skip_status: true })
    .catch(function (err) {
      console.log('caught error', err.stack)
    })
    .then(function (result) {
      // `result` is an Object with keys "data" and "resp".
      // `data` and `resp` are the same objects as the ones passed to the callback.
      // See https://github.com/ttezel/twit#tgetpath-params-callback for details.
      const data = result.data;
      user.id = data.id.toString();
      user.alias = data.screen_name; //Get profile name
      user.image = data.profile_image_url; //Get profile image
      user.background = data.profile_banner_url; //Get background image
      // next();
    });

  // Get the 5 most recent tweets
  T.get('statuses/user_timeline', { screen_name: user.name, count: 5 },  function (err, data, res) {

    if(err){
      const err = new Error("Oops! We couldn't get your most recent tweets.");
      err.status = 500;
    }
    else {

      // user.tweets = data;
      const tweets = [];
      for (let tweetData of data){
        const tweet = {
          name: tweetData.user.name,
          alias: tweetData.user.screen_name,
          image: tweetData.user.profile_image_url,
          text: tweetData.text,
          time: elapsedTime(getTimestamp(tweetData.created_at)),
          retweets: tweetData.retweet_count,
          likes: tweetData.favorite_count
        };
        tweets.push(tweet);
      }
      user.tweets = tweets;
    }
  });

  // Get my 5 latest friends (people I follow)
  T.get('friends/list', { screen_name: user.name, count: 5 },  function (err, data, res) {

    if(err){
      const err = new Error("Oops! We couldn't get your friends list.");
      err.status = 500;
    }
    else {
      user.friends = data;
    }
  });


  //(Get events).then(get user info).then(res.render)
  // Get the 5 latest private messages in my last private conversation
  T.get('direct_messages/events/list', { count: 10 }, async function (err, data, response) {
    if(err){
      const err = new Error("Oops! We couldn't get get your direct messages.");
      err.status = 500;
    }
    else {
      messageData = data.events;
      // user.messageData = data.events;
    }
  }).then(function(){
    const messages = [];
    for (let msg of messageData){
      // const senderID = msg.message_create.sender_id;
      T.get('users/show', { user_id: msg.message_create.sender_id }, function(err, data, res){
        if (err) {
          console.log(err);
        }
        else {
          const message = {
            senderId: data.id_str,
            senderName: data.name,
            senderAlias: data.screen_name,
            senderImage: data.profile_image_url_https,
            text: msg.message_create.message_data.text,
            time: elapsedTime(msg.created_timestamp)
          };
          messages.push(message);
        }
        user.messages = messages;
      });
    }

  }).then(function(){
    res.locals.user = user;
    res.render('index');
  });
});

app.post('/', (req, res) => {

  const tweet = req.body.tweet;

  T.post('statuses/update', { status: tweet }, function(err, data, response) {
    if(err){
      const err = new Error("Oops! We couldn't post your tweet.");
      err.status = 500;
    }
    else {
      res.locals.user = user;
      res.redirect('/');
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
  res.render('error', err);
});

app.listen(3000, () => {
  console.log('The application is running on localhost:3000');
}); // The app listens to port 3000 (localhost)

//Calculate elapsed time
function elapsedTime(time) {
  const currentTime = Date.now();
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;
  const elapsed = currentTime - time;

  if (elapsed < msPerMinute) {
       return Math.round(elapsed/1000) + ' seconds ago';
  }
  else if (elapsed < msPerHour) {
       return Math.round(elapsed/msPerMinute) + ' minutes ago';
  }
  else if (elapsed < msPerDay ) {
       return Math.round(elapsed/msPerHour ) + ' hours ago';
  }
  else if (elapsed < msPerMonth) {
      return Math.round(elapsed/msPerDay) + ' days ago';
  }
  else if (elapsed < msPerYear) {
      return Math.round(elapsed/msPerMonth) + ' months ago';
  }
  else {
      return Math.round(elapsed/msPerYear ) + ' years ago';
  }
}
