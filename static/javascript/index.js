var username = "User"

$( document ).ready(function() {
	$('#myModal').modal('show');
    var evtSrc = new EventSource("/subscribeToChat");
    evtSrc.onmessage = function(e) {
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

function sendImage(){
	var message = $("#message").val();
	$.ajax({
		url: "http://flickr.com/services/rest/?",
		dataType: "jsonp",
		method: "GET",
		jsonp: 'jsoncallback',
		data: {
			method: 'flickr.photos.search',
			api_key: 'b207e9ca3796129473bcfe3b6b6825ba',
			tags: 'dog',
			format: 'json',
        },
    	success: function(response) {
	        photos = response.photos.photo;
	        urls = [];
	        for (index in photos){
	        	url  = 'https://farm'+photos[index].farm+'.staticflickr.com/'+photos[index].server 
	        		+'/'+photos[index].id +'_'+photos[index].secret+'.jpg';
	        	urls.push(url);
	        }
			ImageLoader.loadImageData(urls[0],
				function(data){
					var hidden = SteganographyTool.hide(data, message);
					var hiddenURL = ImageLoader.dataToURL(hidden); 
				    $.ajax({
					url: "/publishMessage",
					method: "POST",
					data: {
							sender: username,
							content: hiddenURL,
							type: 'stego-image',
			        }
			    }); 
			});          
      	}
    });
}
