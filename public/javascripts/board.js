// socket.io code
var socket = io.connect();

socket.on('announcement', function(msg) {
	$('#chat_messages').append(($('<li>').addClass('announcement')).text(msg));
});

socket.on('nicknames', function(nicknames) {
	$('#users_list').empty();
	for (var i in nicknames) {
		$('#users_list').append($('<li>').append(($('<span>').addClass('chat_message')).text(nicknames[i])));
	}
});

socket.on('user message', message);
function message(from, msg) {
	$('#chat_messages').append(($('<li>').addClass('chat_line')).append($('<b>').text(from), msg));
}

// dom manipulation
$(function() {	
	$('#set-nickname').submit(function(ev) {
		socket.emit('nickname', $('#nick').val(), function(set) {
			if (!set) {
				clear();
				$('#set-nickname').addClass('hide');
				return $('#chat_form').removeClass('hide');
			}
		});
		return false;
	});
	
	$('#chat_form').submit(function() {
		message('me', $('#input_chat_message').val());
		socket.emit('user message', $('#input_chat_message').val());
		clear();
		$('#chat_messages').get(0).scrollTop = 10000000;
		return false;
	});
	
	function clear() {
		$('#input_chat_message').val('').focus();
	}
});