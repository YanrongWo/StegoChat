
var ImageLoader = {

	"loadImageData": function(url, success){
		var img = new Image();
		img.crossOrigin='anonymous';

		var canvas = document.createElement("canvas");

		var ctx = canvas.getContext('2d');

		(function(cc, ii, succ){
			img.onload = function() {
				cc.drawImage(img, 0, 0);
				ii.style.display = 'none';
			
				var data = cc.getImageData(0,0, ii.width, ii.height);
				succ(data);
			}
		})(ctx, img, success);

		img.src = url;
	},

	"dataToURL": function(data){
		var canvas = document.createElement("canvas");

		var ctx = canvas.getContext('2d');
		ctx.putImageData(data, 0, 0);

		return canvas.toDataURL();
	}
};

var SteganographyTool = {
	"find": function(data){
		var msgBits = [];
		
		for(var i = 0; i < data.height; i++){
			for(var j = 0; j < data.width; j++){
				var c = (i*4*data.width) + (j*4);

				var b1 = data.data[c+2];

				if((b1 & 1)==1){
					msgBits.push(1);
				} else{
					msgBits.push(0);
				}
			}
		}

		var len = "";
		var lendec = -1;
		var message = "";

		for(var i = 0; i < msgBits.length; i = i + 8){
			
			var msgByte = 0;
			for(var j = 7; j>=0; j--){
				msgByte += (msgBits[i+(7-j)] << j);
			}

			if(i/8 <= 2){
				len = len + String.fromCharCode(msgByte);
				lendec = parseInt(len);
			} else{
				if( (i/8) - 3 >= lendec) break;

				message = message + String.fromCharCode(msgByte);
			}
		}

		return message;

	},

	"hide": function(data, message){

		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext('2d');
		var modData = ctx.createImageData(data.width, data.height);

		var v = message.length;
		if(v < 10){
			message = "00"+message.length+message;
		}
		else if(v < 100){
			message = "0"+message.length+message;
		} else{
			message = message.length+message;
		}


		var msgBytes = [];
		var msgBits = [];
		for(var i = 0; i < message.length; i++){
			var mByte = message.charCodeAt(i);

			for(var j = 7; j >= 0; j--){
				msgBits.push(mByte & (1 << j) ? 1 : 0);
			}

		}

		var modified_data = []
		var bit = 0;
		for(var i = 0; i < data.height; i++){
			for(var j = 0; j < data.width; j++){
				var c = (i*4*data.width) + (j*4);
				var r = data.data[c];
				var g = data.data[c + 1];
				var b = data.data[c + 2];
				var a = data.data[c + 3];

				var d = b;
				if(bit < msgBits.length){
					if( (b & 1) == 1 && msgBits[bit] == 0){
						d = b - 1;
					} else if((b & 1) == 0 && msgBits[bit] == 1){
						d = b + 1;
					}

				}

				modData.data[c] = r;
				modData.data[c+1] = g;
				modData.data[c+2] = d;
				modData.data[c+3] = a;

				bit += 1;
			}
		}

		return modData;
	}
}