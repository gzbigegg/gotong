var express = require('express'), routes = require('./routes')
var sio = require("socket.io");
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/board', routes.board);
app.get('/', routes.index);

app.listen(4000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

var io = sio.listen(app);
var nicknames = {};

io.sockets.on('connection', function(socket) {
	socket.on('user message', function(msg) {
		socket.broadcast.emit('user message', socket.nickname, msg);
	});
	
	socket.on('nickname', function(nick, fn) {
		if (nicknames[nick]) {
			fn(true);
		}
		else {
			fn(false);
			nicknames[nick] = socket.nickname = nick;
			socket.broadcast.emit('announcement', nick + ' connected');
			io.sockets.emit('nicknames', nicknames);
		}
	});
});