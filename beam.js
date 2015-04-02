var WebSocket = require('ws');
var request = require('request');
var cmd = require('./cmd');
var util = require('./util');

var headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.45 Safari/537.36'};

var socket =
{
    connectChannel: function(auth)
    {
        this.auth = auth;
        this.reconnect();
    },
    
    reconnect: function()
    {
        if (!this.auth || !this.auth.points) return console.warn("No endpoints found!");
        
        this.msgId = 0;
        this.authed = false;
        var point = this.auth.points[rand(0, this.auth.points.length-1)];
        this.ws = new WebSocket(point);
        
        this.ws.on('open', function() {
            util.log("Connected!", true);
            socket.sendAuth();
        });
        
        this.ws.on('message', function(data, flags) {
            socket.onMsg(JSON.parse(data));
        });
        
        this.ws.on('close', function() {
            util.log("Websocket disconnected!");
            socket.ws = null;
            socket.authed = false;
        });
    },
    
    close: function()
    {
        this.sendMsg("tlfbot going offline...");
        this.ws.close();
    },
    
    sendAuth: function()
    {
        if (!this.ws) this.reconnect();
        if (!this.ws) return;
        if (!this.auth) return;
        util.log("Authenticating");
        this.send("auth", [this.auth.chanid, this.auth.userid, this.auth.key]);
    },
    
    sendMsg: function(msg)
    {
        if (!this.ws) this.reconnect();
        if (!this.ws || !this.authed) return err("WebSocket is nil or not authed");
        if (!msg) return err("Tried to send a nil message");
        
        this.send("msg", [msg]);
    },
    
    send: function(type, msg) {
        if (!this.ws) reconnect();
        if (!this.ws) return;
        
        this.ws.send(JSON.stringify({
            type:"method",
            method: type,
            arguments: msg,
            "id":this.msgId++
        }));
    },
    
    onMsg: function(msg)
    {
        if (msg.type == 'event')
        {
            if (msg.event == 'Stats') {
                cmd.data.chatters = Math.abs(msg.data.chatters)-735; //TODO the hell?
                cmd.data.viewers = msg.data.viewers;
            } else if (msg.event == 'ChatMessage')
            {
                var s = "";
                msg.data.message.forEach(function (mes) {
                    if (mes.type == 'text')
                    s += mes.data;
                    else if (mes.type == 'link') {
                        if (mes.text == mes.url)
                            s += mes.text;
                        else
                            s += "["+mes.text+"]("+mes.url+")";
                    } else if (mes.type == 'emoticon')
                        s += mes.text;
                });
                
                if (s.substring(0,1) == "!" && msg.data.user_name != this.auth.user) cmd.parsecmd(s, msg.data.user_name, function(msg) {socket.sendMsg(msg);});
                console.log("["+getFormattedTime()+"] "+msg.data.user_name+": "+s.replace('\n', ''));
            } else if (msg.event == 'UserJoin')
            {
                if (msg.data.username == this.auth.user) {
                    this.sendMsg("tlfbot is now active - type !help for commands")
                } else
                    this.sendMsg("Welcome "+msg.data.username+" to the chat!");
            } else if (msg.event == 'UserLeave')
                this.sendMsg(msg.data.username+" has left. :(");
            else
                console.log(msg); //Unknown type;
        } else if (msg.type == 'reply' && msg.id == 0)
        {
            this.authed = msg.data.authenticated || false; //Authenticated?
            if (this.authed) util.log("Authenticated!", true);
            else err("Authentication failed!", true);
        } else
            console.log(msg); //Unknown type;
    },
}

var beam =
{
    login: function(login, cb)
    {
        this.query("users/login", 'post', {
            username: login.username,
            password: login.password
        }, function(err, data) {
            if (err) return console.warn(err);
            cb(data);
        });
    },
    
    getChannelId: function(username, cb)
    {
        this.query('channels/search', 'post', {
            scope: 'names',
            query: username
        }, function (err, data) {
            if (err) return console.warn(err);
            cb(data[0].id);
        });
    },
    
    getAuth: function(channel, cb)
    {
        this.query('chats/'+channel, 'get', null, function (err, data) {
            if (err) return console.warn(err);
            var d = JSON.parse(data);
            cb(d.authkey, d.endpoints);
        });
    },
    
    query: function(page, method, json, cb)
    {
        var data = {
            method: method,
            url: 'https://beam.pro/'+(page.substring(0, 1) === '/' ? '' : 'api/v1/')+page,
            jar: true,
            headers: headers
        };
        
        if (json) data.json = json;
        request(data, function (err, res, data) {
            cb(err, data);
        });
    },
    
    socket: socket,
};

module.exports = beam;

//Helper functions
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function getFormattedTime() {
    var d = new Date();
    return months[d.getMonth()]+"/"+d.getDay()+"/"+((""+d.getFullYear()).substring(2,4))+", "+ensureZero(d.getHours())+":"+ensureZero(d.getMinutes())+":"+ensureZero(d.getSeconds());
}
function ensureZero(s) {
    return ""+(s < 10 ? "0"+s : s)
}
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}