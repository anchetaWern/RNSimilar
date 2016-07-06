import RNFetchBlob from 'react-native-fetch-blob';

module.exports = {
	upload: function(url, api_key, photo, query_params){
		
		if(typeof query_params != 'undefined'){		
			let ret = [];
			for(let d in query_params){
				ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(query_params[d]));
			}
			
			let url = url + "?" + ret.join("&");
		}
		
		return RNFetchBlob.fetch('POST', url, {
			'Accept': 'application/json',
		    'Content-Type': 'application/octet-stream',
		    'Ocp-Apim-Subscription-Key': api_key
		}, photo)
		.then((res) => {
			return res.json();		
		})
		.then((json) => {
			return json;
		})
		.catch(function (error) {
			console.log(error);
		});
	},

	request: function(url, method, api_key, data){

		let headers = {
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key': api_key
		};
		
		let options = {
			'method': method,
			'headers': headers
		};

		if(typeof data != 'undefined'){
			options.body = data;
		}

		return fetch(url, options)
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			return json;
		})
		.catch(function(error){
			console.log(error);
		});
	}

}

