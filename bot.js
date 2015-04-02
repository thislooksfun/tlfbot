var beam = require('./beam');
var util = require('./util');

module.exports =
{
    running: false,
    
    start: function()
    {
        var options = {auth: {}};
        options.login = JSON.parse(require('fs').readFileSync('./login.json').toString('UTF8').replace('\n', ''));
        options.auth.user = options.login.username;
        
        util.log("Logging in");
        beam.login(options.login, onLogin);
        
        function onLogin(data) {
            options.auth.userid = data.id;
            util.log("Logged in as "+options.login.username, true);
            getId();
        }
        
        function getId() {
            util.log("Getting channel id");
            beam.getChannelId(options.login.channels[0], function(id) { //TODO: add support for more than one channel
                options.auth.chanid = id;
                util.log("Got id!", true);
                getAuth();
            });
        }
        
        function getAuth() {
            util.log("Getting auth key");
            beam.getAuth(options.auth.chanid, function(key, points) {
                options.auth.key = key;
                options.auth.points = points;
                util.log("Got auth key", true);
                connect();
            });
        }
        
        function connect() {
            beam.socket.connectChannel(options.auth);
        }
        
        this.running = true;
    },
    send: function(msg) {
        beam.socket.sendMsg(msg);
    },
    restart: function() {
        beam.socket.close(true);
        this.running = false;
        this.start();
    },
    stop: function() {
        beam.socket.close();
        this.running = false;
    },
}