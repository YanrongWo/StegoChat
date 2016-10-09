var username = ""

$( document ).ready(function() {
	$('#myModal').modal('show');
    var evtSrc = new EventSource("/subscribeToChat");
    evtSrc.onmessage = function(e) {
    	console.log("hello");
    	console.log(e);
    	$("#convo_section").append('<div>'+e.data+'</div>')
    };
});

function setUsername(){
	username = $("#username").val();
	$('#myModal').modal('hide');
}

function sendMessage(){
	var message = $("#message").val();
	$.ajax({
		url: "/publishMessage",
		method: "POST",
		data: {
				sender: username,
				content: message,
				type: 'text',
        }
    });
}
