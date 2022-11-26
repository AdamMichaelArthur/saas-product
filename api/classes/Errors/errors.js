/*	This is our Base class, all classes in this project extend this class
 *
 *	Any functionality that needs to be made available to all classes should be implemented here
 *
*/

const standardErrors = {

	"default_error": {
			"Result": "Failure",
			"StatusCode": 400,
			"Error": 100,
			"ErrorDetails": {
				"Error": 100,
				"Description": "An Unnamed error has occurred",
			}
	},

	"bad_request": {

	},

	"unsupported-content-type" : {
		"Result": "Failure",
			"StatusCode": 400,
			"Error": 20,
			"ErrorDetails": {
				"Error": 20,
				"Description": "Unsupported Content Type",
				"DeveloperInfo": `Look in ExpressServer.js, Find: "const content_type = req.get('Content-Type');"  If you need to support more content-types, this is where you'll let it pass.`
			}				
	},

	"invalid_route": {
			"Result": "Failure",
			"StatusCode": 404,
			"Error": 101,
			"ErrorDetails": {
				"Error": 101,
				"Description": "This is an invalid endpoint"
			}
	},

	"invalid_parameters": {
			"Result": "Failure",
			"StatusCode": 400,
			"Error": 102,
			"ErrorDetails": {
				"Error": 102,
				"Description": "There are missing or extra parameters in the request"
			}	
	},

	"invalid_sql_statement": {
			"Result": "Failure",
			"StatusCode": 400,
			"Error": 103,
			"ErrorDetails": {
				"Error": 103,
				"Description": "The SQL Provided was invalid"
			}	
	},

	"invalid_json": {
			"Result": "Failure",
			"StatusCode": 400,
			"Error": 104,
			"ErrorDetails": {
				"Error": 104,
				"Description": "There is a syntax error in the JSON Body.  Check the posted JSON to make certain its valid"
			}	
	},

	"amazon-initializion": {
			"Result": "Failure",
			"StatusCode": 400,
			"Error": 105,
			"ErrorDetails": {
				"Error": 105,
				"Description": "There was an error initializing the Amazon SP-API Object.  This is likely a result of outdated or incorrect auth tokens.  See integrations/amazon/amazon.js for context"
			}	
	},

	"unauthorized": {
			"Result": "Failure",
			"StatusCode": 401,
			"Error": 99,
			"ErrorDetails": {
				"Error": 99,
				"Description": "You are not authorized to access this resource"
			}	
	},

	"malformed_authorization_cookie" : {
			"Result": "Failure",
			"StatusCode": 400,
			"Error": 98,
			"ErrorDetails": {
				"Error": 98,
				"Description": "Malformed Authorization Cookie"
			}			
	},

	"error-string" : {
			"Result": "Failure",
			"StatusCode": 400,
			"Error": 106,
			"ErrorDetails": {
				"Error": 106,
				"Description": "This is an error I made for demonstration purposes"
			}			
	}

}

export default class Errors {

	constructor(){
		
	}

	error(error_desc ="default", context =null){
		var err = standardErrors[error_desc]

		if(typeof standardErrors[error_desc] !== 'undefined'){
			if(context != null){
				err = { ... err, "Context": context }
			}
			this.res.status( err["StatusCode"] );
			this.res.json( err ) ;
		} else {

			err = standardErrors["default_error"]
			try {
				this.res.status( 400 );
			} catch(err){
				// We're probably outside an express route function call
			}

			if(context != null){
				err["context"] = context;
			}
			try {
				this.res.json( err ) ;
			} catch(err){
				// We're probably outside an express route function call
			}
		}
		return false;
	}

	_error(error_desc, context){
		console.log(99, error_desc);
		//this.res.status( 400 );
		this.res.json( error_desc ) ;
	return false;		
	}

	_formatError(error_desc, context =null, statusCode =400, ErrorNum =100){
		var err = standardErrors[error_desc]
		if(typeof standardErrors[error_desc] !== 'undefined'){
			if(context != null){
				err = { ... err, "Context": context }
			}
		} else {
			err = standardErrors["default_error"]
			err["StatusCode"] = statusCode;
			err["Error"] = ErrorNum;
			if(context != null){
				err["context"] = context;
			}
			err["ErrorDetails"]["Description"] = error_desc
		}
		return err;		
	}

	throw(error_desc ="default", context =null){
		var er = new Error();
		er.Errors = this;
		er.err = this._formatError(error_desc, context);
		throw er;
		return false;
	}

}