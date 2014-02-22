
module.exports = function(FxaUser) {

function FxaSyncAuth(syncAuth, options) {
  this.syncAuth = syncAuth;
  this.options = options;
  this.hash = options.hash;
}

FxaSyncAuth.prototype.auth = function(email, password) {
  var user = new FxaUser(email, password, this.options);
  return user.setup()
    .then(function() {
      this.keys = user.syncKey;
      return user.getAssertion(this.options.audience, this.options.duration);
    }.bind(this))
    .then(function(assertion) {
      console.log('syncKey', user.syncKey);
      var clientState = this.hash(user.syncKey).slice(0, 16).toString('hex');
      console.log('clientState', clientState);
      return this.syncAuth.auth(assertion, clientState);
    }.bind(this))
    .then(function(token) {
      console.log('got tokens', token, this.keys);
      return {
        token: token,
        keys: this.keys,
        credentials: {
          sessionToken: user.creds.sessionToken,
          keyPair: user._keyPair
        }
      };
    }.bind(this));
};

FxaSyncAuth.prototype.refreshAuth = function(creds) {
  var user = new FxaUser();
};

FxaSyncAuth.prototype.creds = function(creds) {
};

return FxaSyncAuth;

};