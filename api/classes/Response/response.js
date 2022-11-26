export default class Response{

	successResponse = {
	    "Result": "Success",
	    "Error": 0,
	    "ErrorDetails": {
	        "Error": 0,
	        "Description": "The operation was successful"
	    }
	}

	constructor(){
	}

	reply(data){
		if(typeof data == "string"){
			data = { result: data }
		}

		if(typeof data == "number"){
			data = { result: data }
		}

		if(Array.isArray(data)){
			data = { result: data }
		}

		var response = {
			... this.successResponse,
			... data
		}
		
		this.res.status(200);
		this.res.json(response);
	}

	redirect(path){
		this.res.redirect(path);
	}

}