const Twit = require('twit'); //Require Twit to be able to use it
const config = require('./../config');
const T = new Twit(config);

module.exports = {
  verifyAccount: function(bool){
    T.get('account/verify_credentials', { skip_status: bool })
    .catch(function (err) {
      console.log('caught error', err.stack)
    })
    .then(function (result) {
      const data = result.data;
      return {
        id: data.id.toString(),
        alias: data.screen_name, //Get profile name
        image: data.profile_image_url, //Get profile image
        background: data.profile_banner_url //Get background image
      }
    });
  },
  getTweets: function(count) {
    T.get('statuses/user_timeline', { count: count })
      .catch(function (err) {
        console.log('caught error', err.stack)
      })
      .then(function (result) {
        return result;
      });
  },
  getMessages: function(count) {
    T.get('direct_messages/events/list', { count: count })
      .catch(function (err) {
        console.log('caught error', err.stack)
      })
      .then(function (result) {
        return result;
      });
  },
  getFriends: function(count) {
    T.get('friends/list', { count: count })
      .catch(function (err) {
        console.log('caught error', err.stack)
      })
      .then(function (result) {
        return result;
      });
  },
  getUser: function(userId) {
    T.get('users/show', { user_id: userId })
      .catch(function (err) {
        console.log('caught error', err.stack)
      })
      .then(function (result) {
        return result;
      });
  }
};
