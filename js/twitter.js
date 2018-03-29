const Twit = require('twit'); //Require Twit to be able to use it
const config = require('./../config');
const T = new Twit(config);

module.exports = {
  verifyAccount: function(bool){
    return T.get('account/verify_credentials', { skip_status: bool });
      // .catch(function (err) {
      //   console.log('caught error', err.stack)
      // })
      // .then(function (result) {
      //   console.log(result.data)
      //   return result.data;
      // });
  },
  getTweets: function(count) {
    return T.get('statuses/user_timeline', { count: count });
      // .catch(function (err) {
      //   console.log('caught error', err.stack)
      // })
      // .then(function (result) {
      //   return result;
      // });
  },
  getMessages: function(count) {
    return T.get('direct_messages/events/list', { count: count });
      // .catch(function (err) {
      //   console.log('caught error', err.stack)
      // })
      // .then(function (result) {
      //   return result;
      // });
  },
  getFriends: function(count) {
    return T.get('friends/list', { count: count });
      // .catch(function (err) {
      //   console.log('caught error', err.stack)
      // })
      // .then(function (result) {
      //   return result;
      // });
  },
  getUser: function(userId) {
    return T.get('users/show', { user_id: userId });
      // .catch(function (err) {
      //   console.log('caught error', err.stack)
      // })
      // .then(function (result) {
      //   return result;
      // });
  }
}
