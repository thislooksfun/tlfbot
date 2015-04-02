var beam = require('./beam');

module.exports =
{
  running: false,
  
  start: function()
  {
    var options = {channel: "thislooksfun", auth: {}};
    options.login = JSON.parse(require('fs').readFileSync('../login.json').toString('UTF8').replace('\n', ''));
    options.auth.user = options.login.username;

    logBig("Logging in");
    beam.login(options.login, onLogin);

    function onLogin(data) {
      options.auth.userid = data.id;
      logBig("Logged in as "+options.login.username, true);
      getId();
    }

    function getId() {
      logBig("Getting channel id");
      beam.getChannelId(options.channel, function(id) {
        options.auth.chanid = id;
        logBig("Got id!", true);
        getAuth();
      });
    }

    function getAuth() {
      logBig("Getting auth key");
      beam.getAuth(options.auth.chanid, function(key, points) {
        options.auth.key = key;
        options.auth.points = points;
        logBig("Got auth key", true);
        connect();
      });
    }

    function connect() {
      logBig("Connecting");
      beam.socket.connectChannel(options.auth);
    }

    function logBig(msg, newline) {
      console.log("##### MSG: ["+msg+"] #####"+(newline?"\n":""));
    }
    function errBig(msg, newline) {
      console.warn("##### ERR: ["+msg+"] #####"+(newline?"\n":""));
    }
    
    this.running = true;
  },
  stop: function() {
    beam.socket.close();
    this.running = false;
  },
}