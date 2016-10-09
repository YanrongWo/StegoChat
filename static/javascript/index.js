$( document ).ready(function() {
	$('#myModal').modal('show')
    var evtSrc = new EventSource("/subscribe");
    evtSrc.onmessage = function(e) {
    	console.log(e.data);
    	$("#convo_section").append('<div>'+e.data+'</div>')
    };
}

