/*    This is our Base class, all classes in this project extend this class
 *
 *    Any functionality that needs to be made available to all classes should be implemented here
 *
 */
import Errors from '../Errors/errors.js'
import Response from '../Response/response.js'
import Authorization from '../Authorization/authorization.js'
import Voca from 'voca'

export default class Base extends Authorization {

    route = '';
    class = '';

    constructor(sibling = null, route ='', className ='') {
        super()
        this.errors = new Errors();
        this.response = new Response();
        this.voca = Voca

        if(route != ''){
                    this.route = route;
                }
                if(className != ''){
                    this.class = className;
                }

        if (sibling !== null) {
            Object.assign(this, sibling)
            if (typeof this.app !== 'undefined') {
                if(route != ''){
                    this.route = route;
                }
                if(className != ''){
                    this.class = className;
                }

                this.app.use(this.route, (req, res, next) => {

                    this.initRequestVariables(req, res);

                    var result = true;
                    try {
                        result = this.routeEndpoint();
                    } catch (err) {
                        // The error handling logic will have sent a response to the client
                        return;
                    }

                    if (result == false) {
                        // The error handling logic will have sent a response to the client
                        return result;
                    }
                })
            }

        }
    }

    initRequestVariables(req, res){

        this.req = req;
        this.res = res;
        this.errors.res = this.res;
        this.errors.req = this.req;
        this.response.res = this.res;
        this.response.req = this.req;
        this.body = { ... this.req.body };
        this.database.errors = this.errors;
        this.transform = false;
        this.user_id = this.res.locals.user_id;
        this.amz = res.locals.amz;
        this.method = this.req.method;

        this.fullUrl = this.req.protocol + '://' + this.req.get('host') + this.req.originalUrl;

        var urlParts = this.fullUrl.split("?");
        if(typeof urlParts[1] != 'undefined'){
            this.queryString = urlParts[1];    
        } else {
            this.queryString = "";
        }


        this.domainWithProtocol = this.req.protocol + '://' + this.req.get('host')
        this.domain = this.req.get('host');
        this.path = this.voca.trimRight(req.originalUrl.replace(/\?.*$/, ''), "/");
        this.query = this.req.get('query');

    }

    routeEndpoint() {
        var fullUrl = this.req.protocol + '://' + this.req.get('host') + this.req.originalUrl;

        var endofurl = fullUrl.indexOf("?");
        if (endofurl != -1) {
            fullUrl = fullUrl.substring(0, endofurl);
        }

        console.log(101, this.class);
        var endpoint = this.getEndpoint(fullUrl, this.class);

        if (endpoint == false) {
            this.errors.error("invalid_route");
        }

        var evalCode = "this." + endpoint + "()";

        var result = true;
        try {
            result = eval(evalCode);
        } catch (err) {
            this.errors.error("invalid_route");
        }

        return result;
    }

    getEndpoint(str, parameter) {
        var params = str.split("/");
        for (var i = 0; i < params.length; i++) {
            if (params[i] == parameter)
                if (i + 1 < params.length){
                    console.log(124, parameter, params[i + 1])
                    return params[i + 1];
                }
        }
        return false;
    }

    requiredParams(requiredKeys =[], optionalKeys =[]) {

        if(!Array.isArray(requiredKeys)){
            console.error("requiredParams:requiredKeys must be an array.");
            return false;
        }

        if(!Array.isArray(optionalKeys)){
            console.error("requiredParams:requiredKeys must be an array.");
            return false;
        }

        
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

            // let's check for query parameters.query
            missingKeysTmp = [ ... missingKeys ];

            for(var missingKey of missingKeys){
               var keys = Object.keys(this.req.query);
               console.log(keys, missingKey);
               for(var key of keys){                   
                   if(key == missingKey){
                       this.body[key] = this.req.query[key];
                       var indexOfKey = missingKeysTmp.indexOf(key);
                       missingKeysTmp.splice(indexOfKey, 1)
                   }
               }   
            }

            missingKeys = missingKeysTmp;

            // The default value for any optional keys is false
            for(var optionalKey of optionalKeys){
                this.body[optionalKey] = false;
            }

            for(var optionalKey of optionalKeys){
               var keys = Object.keys(this.req.query);

               for(var key of keys){                      
                   if(key == optionalKey){  
                    this.body[optionalKey] = this.req.query[optionalKey];
                    if(this.body[optionalKey] == "true"){
                        this.body[optionalKey] = true;
                    if(this.body[optionalKey] == "false"){
                        this.body[optionalKey] = false;
                    }
                }}
                }

            }

            for(var optionalKey of optionalKeys){
               var keys = Object.keys(this.req.body);

               for(var key of keys){                      
                   if(key == optionalKey){  
                    this.body[optionalKey] = this.req.body[key];
                    if(this.body[optionalKey] == "true"){
                        this.body[optionalKey] = true;
                    if(this.body[optionalKey] == "false"){
                        this.body[optionalKey] = false;
                    }
                }}
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

        if(type == "boolean"){
            if(typeof parameter !== 'boolean'){
                return this.errors.error("type-check-failure", `Parameter '${elementType}' with value '${parameter}' must be an ${type}`);
            }
        }

        if(type == "number"){
                    if(typeof parameter !== 'number'){
                        return this.errors.error("type-check-failure", `Parameter '${elementType}' with value '${parameter}' must be an ${type}`);
                    }
                }

        if(type == "integer"){
            if(!Number.isInteger(parameter)){
                return this.errors.error("type-check-failure", `Parameter '${elementType}' with value '${parameter}' must be an ${type}`);
            }
        }

        // It's very common that a number needs to be passed as a string, for example "12345"
        if(type == "numberstring"){
            if (typeof parameter != "string") return this.errors.error("type-check-failure", `Parameter '${elementType}' with value '${parameter}' must be an ${type}`);
            if(isNaN(parameter)){
                if (isNaN(parseFloat(parameter))){
                    return this.errors.error("type-check-failure", `Parameter '${elementType}' with value '${parameter}' must be an ${type}`);
                }
            }
        }
        
        return true;
    }

    /*    URL Parameters are typically supplied in one of two basic patterns:
     *    1) A URI Parameter /url/data/id/124345
     *    
     *    Where we might want to get the value for /id/, 12345
     *
     *    The next way that is common is query parameters:
     *    2) A Query Parameter /url/data?id=12345
     *
     *    getParameter will first search for a URI Parameter, and if found, return that first.  
     *    If it doesn't find a matching value, it will look for a matching query parameter.
     *
     *    If you already know your value is a query parameter, then set queryParam to true.  The
     *    only value here is in the event there are duplicate URI and query parameters, such as /url/data/id/12345?id=678920
     *
     *    The "Express" way of getting these values doesn't quite work well for this project structure, hence these functions
    */
    getParameter(parameter, queryParam =false){

        var parameter = extractParameterFromString(this.path, parameter, 0, this.voca);

        return parameter;
        
        function extractParameterFromString(source, parameter, instance, voca){
            const instances = voca.countSubstrings(source, parameter);
            var instanceIndices = [voca.indexOf(source, parameter)];
            var slashIndices = [voca.indexOf(source, "/", instanceIndices[0])]

            var values = [];
            for(var i = 1; i < instances; i++){
                var prevIndex = i-1;
                instanceIndices.push( voca.indexOf(source, parameter, instanceIndices[prevIndex] + parameter.length) )
                slashIndices.push( voca.indexOf(source, "/", instanceIndices[instanceIndices.length-1]) );
            }

            for(var i = 0; i < instanceIndices.length; i++){
                var currentParameter = voca.substring( source, instanceIndices[i] - 1, instanceIndices[i] + parameter.length + 1)

                if((currentParameter[0] != '/') || (currentParameter[currentParameter.length-1] != '/')){
                    continue;
                }

                currentParameter = voca.substring( source, instanceIndices[i], instanceIndices[i] + parameter.length)

                if(typeof slashIndices[i+1] != "undefined"){
                    if(currentParameter == parameter){
                        var value = voca.substring( source, instanceIndices[i] + parameter.length + 1, voca.indexOf(source, "/", instanceIndices[i] + parameter.length + 1) )
                        values.push(value);
                    }
                } else {
                    if(currentParameter == parameter){
                        var nextSlash = voca.indexOf(source, "/", instanceIndices[i] + parameter.length + 1);
                        if(nextSlash == -1){
                            nextSlash = source.length
                        }
                        values.push(voca.substring( source, instanceIndices[i] + parameter.length + 1, nextSlash ))
                    }
                }
            }

            if(values.length == 0){
                return false;
            }

            if(values.length == 1){
                return values[0];
            }

            return values;

        }
    }

    getURIParameter(parameter){

    }

    getQueryParameter(parameter){

    }
}


