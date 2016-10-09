var username = "User"

$( document ).ready(function() {
	$('#myModal').modal('show');
    var evtSrc = new EventSource("/subscribeToChat");
    evtSrc.onmessage = function(e) {
    	data = JSON.parse(e.data);
    	console.log(data.sender);
    	var content = "";
    	if (data.type == "text"){
    		content = "<p class='normal_text medium_text user_text'>"+ data.content+"</p>";
    	} else {
    		content = "<div class='relative'><img src='" + data.content + "' onclick='decodeImage(this)'/></div>";
    	}
    	$("#convo_section").append('<div><p class="normal_text medium_text user">'+data.sender+':&nbsp;&nbsp;&nbsp;&nbsp;</p>'+ content +'</div>');
    	var objDiv = document.getElementById("convo_section");
		objDiv.scrollTop = objDiv.scrollHeight;
    };
});

function setUsername(){
	username = $("#username").val();
	$('#myModal').modal('hide');
}

function sendMessage(){
	var message = $("#message").val();
	$("#message").val('');
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

function openStegoModal(){
	$('#stegoModal').modal('show');
}

function getImages(){
	var query = $("#imageSearch").val();
	$("#imageSearch").val('');
	$.ajax({
		url: "http://flickr.com/services/rest/?",
		dataType: "jsonp",
		method: "GET",
		jsonp: 'jsoncallback',
		data: {
			method: 'flickr.photos.search',
			api_key: 'b207e9ca3796129473bcfe3b6b6825ba',
			tags: query,
			format: 'json',
        },
    	success: function(response) {
    		$("#stego_image_div").html('');
	        photos = response.photos.photo;
	        urls = [];
	        for (index in photos){
	        	url  = 'https://farm'+photos[index].farm+'.staticflickr.com/'+photos[index].server 
	        		+'/'+photos[index].id +'_'+photos[index].secret+'.jpg';
	        	$("#stego_image_div").append("<div class='wrapper'><img src='" + url + "' class='stego_image' onclick='sendImage(this)'></div>")
	        	if (index > 13)
	        	{
	        		break;
	        	}
	    	}
	    }	
	});
}

function sendImage(obj){
	$('#stegoModal').modal('hide');
	var message = $("#imageMessage").val();
	$("#imageMessage").val('');
	var image = $(obj).attr('src')
	ImageLoader.loadImageData(image,
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

function decodeImage(obj){
	var src=obj.src;
	ImageLoader.loadImageData(src, function(data){
		var message = SteganographyTool.find(data);
		$(obj).parent().append("<div class='trans_overlay' onclick='remove(this)'>"+message+"</div>");
	});	
}

function remove(obj){
	$(obj).remove();
}
