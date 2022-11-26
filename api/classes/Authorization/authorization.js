import Voca from 'voca'
import Errors from '../Errors/errors.js'
import Response from '../Response/response.js'
import bcrypt from 'bcrypt'
import btoa from 'btoa'
import atob from 'atob'

/*	This class is not production ready
 *	This class is not production ready
 *	This class is not production ready
 *	This class is not production ready
*/
export default class Authorization {

    constructor(sibling = null, route ='', className ='') {
        this.voca = Voca
        this.response = new Response();
    }

    authorizeUser(req){
        console.log(21, req.headers)
    	// Check and see if we have an authorization cookie
    	var authHeader = req.cookies["Authorization"];  
    	if(authHeader == null){

            if(req.headers["authorization"] != null){
                if(req.headers["authorization"] == "Bearer AAAAAAAAAAAAAAAAAAAAAPa7DgEAAAAA38GtrW7n6AM4X%2BTRZBQN7IXrGVc%3D4piaIOBTZHcjKwxPLOgbuDmLrQdlnPbz1EpE6w07AGSu5f9W7s")
                    return true;
                else
                    return false;
            } else {
    		return false;
        }
    	}

    	var basicStr = authHeader.substring(0, 5);
    	if(basicStr !== 'Basic'){
    		return false;
    	}

	    var base64Str = authHeader.substring(6, authHeader.length+6);
	    var decodedAuthString = atob(base64Str);

	    var stringInfo = decodedAuthString.split(":");

	    this.user_id = stringInfo[0];
	    this.hash = stringInfo[1];

    	return true;
    }

    /* 8/2/22 -- this is obviously not production ready */
    authorize(req, res){

        console.log(46, req.headers);

    	this.errors.req = req;
		this.errors.res = res;

		this.res = res;
		this.req = req;

		this.response.res = res;
		this.response.req = req;

		const hasRequiredParameters = this.requiredParams(["user_id"], []);		
		if(!hasRequiredParameters){
			return this.errors.error("invalid_parameters", { missing_parameter: "user_id" });
		}

		if(typeof this.req.body.user_id !== 'undefined'){
			this.user_id = req.body.user_id;
			// Drop an authorization cookie
			this.setAuthorizationCookie(this.user_id);
			this.response.reply({ "Result": "You are now logged in" });
			return true;
		} else {
            return true;
        }

		return this.errors.error("unauthorized");
    }

    setAuthorizationCookie(user_id){
    	var authorizationHeader = this.generateAuthorizationBasicString(user_id);
		this.res.cookie("Authorization", "Basic " + authorizationHeader, {
		    expire: new Date() + 365
		});
    }

    generateAuthorizationBasicString(userId)
	{
    	var combinedStr = userId + ":" + this.generateSessionId(userId);
    	return btoa(combinedStr);
	}

	generateSessionId(user_id)
	{
	  const salt = bcrypt.genSaltSync(1);
	  // Hash goes in database
	  const hash = bcrypt.hashSync(user_id, salt);
	  return hash;
	}

    requiredParams(requiredKeys =[], optionalKeys =[]) {
        try {
            var keysInBody = Object.keys(this.req.body);
            var missingKeys = [];

            // Check for any missing keys
            for (var key of requiredKeys) {
                if (keysInBody.indexOf(key) == -1) {
                    missingKeys.push(key)
                }
            }

            var extraKeys = [];
            // Check for extra keys
            for (var key of keysInBody) {
                if (requiredKeys.indexOf(key) == -1) {
                    extraKeys.push(key);
                }
            }


       for(var optionalKey of optionalKeys){
         var pos = 0;
         for(var extraKey of extraKeys){
             if(extraKey == optionalKey){
                 extraKeys.splice(pos, 1);
             }
             pos++;
         }
       }

            if ((missingKeys.length == 0) && (extraKeys.length == 0)) {
                return true;
            }

            // Check and see if we have them in the URL and not the body
            var missingKeysTmp = missingKeys;

            for(var missingKey of missingKeys){
                var param = this.getParameter(missingKey);
                if(param != false){
                    this.body[missingKey] = param;
                    var indexOfKey = missingKeysTmp.indexOf(missingKey);
                    missingKeysTmp.splice(indexOfKey, 1)
                }
            }

            if ((missingKeysTmp.length == 0) && (extraKeys.length == 0)) {
                return true;
            }

            // Finally, let's check for query parameters.query
            missingKeysTmp = [ ... missingKeys ];

            for(var missingKey of missingKeys){
               var keys = Object.keys(this.req.query);
               //console.log(179, keys);
               for(var key of keys){
                   
                   if(key == missingKey){
                       this.body[key] = this.req.query[key];
  
                       var indexOfKey = missingKeysTmp.indexOf(key);
   
                       //console.log(187, indexOfKey, indexOfKey);
                       missingKeysTmp.splice(indexOfKey, 1)
                   }
               }   
            }

            if(typeof this.body.fields != 'undefined'){
                // The user is requesting that only certain fields be returned;
                this.fields = this.body.fields;
                this.transform = true;
            }

            if ((missingKeysTmp.length == 0) && (extraKeys.length == 0)) {
                return true;
            }

            this.errors.error("invalid_parameters", {
                extraParameters: extraKeys,
                missingParameters: missingKeys
            })
        } catch (err) {
            return false;
        }

        return false;
    }

    typeCheck(parameter, type, elementType =null){
        if(type == "array"){
            if(!Array.isArray(parameter)){
                return this.errors.error("type-check-failure", `Parameter ${parameter} must be an ${type}`);
            }

            if(parameter.length == 0){
                return this.errors.error("type-check-failure", `Parameter ${parameter} must not be empty`);
            }

            if(elementType != null){
            for(var element of parameter){
                if(typeof element !== elementType){
                    return this.errors.error("type-check-failure", `Array Element '${element}' must be a ${elementType}`);
                }    
            }}
        }

        if(type == "string"){
            if(typeof parameter !== 'string'){
                return this.errors.error("type-check-failure", `Parameter '${elementType}' with value '${parameter}' must be an ${type}`);
            }

            if(parameter.length == 0){
                return this.errors.error("type-check-failure", `Parameter '${elementType}' must not be an empty string`);
            }
        }
        return true;
    }
}