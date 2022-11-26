/*		amazon.js
 *
 *		The purpose of this file is to implement a callback for Amazon's SP-API
 *		oAuth Authentication Scheme
 */
import Callbacks from './callbacks.js';
import axios from 'axios';
import FormData from 'form-data';
import qs from 'qs';
import Amazon from 'amazon-sp-api'

import AmazonTokens from "../../../../classes/Database/Tables/amazon-tokens.js"

/*	
 *
 *	
 *
 */

export default class AmazonCallback extends Callbacks {

    class = 'amazon';

    constructor(initializers = null) {
        super(initializers, "/public/callbacks/amazon");
        this.amazonTokensTable = new AmazonTokens();
        this.config = {
            "SELLING_PARTNER_APP_CLIENT_ID": process.env.lwa_client_id,
            "SELLING_PARTNER_APP_CLIENT_SECRET": process.env.lwa_client_secret,
            "AWS_ACCESS_KEY_ID": process.env.aws_access_key_id,
            "AWS_SECRET_ACCESS_KEY": process.env.aws_secret_access_key,
            "AWS_SELLING_PARTNER_ROLE": process.env.selling_partner_role
        }
        this.base_domain = process.env.BASE_DOMAIN;
    }

    async authorized() {
        const hasRequiredParameters = this.requiredParams(["state", "selling_partner_id", "spapi_oauth_code"], []);

        if (!hasRequiredParameters) {
            return;
        }

        try {
            var res = await this.exchangeCode(this.body.spapi_oauth_code);
        } catch (err) {
            console.log(35, err);
            return this.errors.error("Unable to exchange Amazon Token", err.response.data);
        }

    }

    async exchangeCode(code) {

        const hasRequiredParameters = this.requiredParams(["spapi_oauth_code", "state", "selling_partner_id"], []);

        const user_id = this.body.state;

        var data = qs.stringify({
            'grant_type': 'authorization_code',
            'code': this.body.spapi_oauth_code,
            'client_id': process.env.lwa_client_id,
            'client_secret': process.env.lwa_client_secret
        });

        var config = {
            method: 'post',
            url: 'https://api.amazon.com/auth/o2/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        var response = null;
        try {
            response = await axios(config);
        } catch (err) {
        	console.log(82, err);
            return this.response.redirect(`https://${this.base_domain}` + "/token-error");

        }

        const tokenInfo = {
            "selling_partner_id": this.body.selling_partner_id,
            "refreshToken": response.data.refresh_token
        }

        var dbResult = await this.amazonTokensTable.createToken(user_id, tokenInfo);
        if(dbResult == false){
        	return this.error.errors("database", "Unable to save refresh token");
        }

        this.response.redirect(`https://${this.base_domain}`);

    }

    /* Intended for development, should be removed in production */
    async getAllTokens(){
        var dbResult = await this.amazonTokensTable.getAllTokens()
        return this.response.reply(dbResult);
    }

    async addToken(){
        const hasRequiredParameters = this.requiredParams(["selling_partner_id", "refreshToken", "user_id"], []);

        const tokenInfo = {
            "selling_partner_id": this.body.selling_partner_id,
            "refreshToken": this.body.refreshToken
        }

        var dbResult = await this.amazonTokensTable.createToken(this.body.user_id, tokenInfo);

        if(typeof dbResult["original"] != 'undefined')
            if(typeof dbResult["original"]["errno"] != 'undefined')
                return this.errors.error("database", dbResult["original"]);

        var allTokens = await this.amazonTokensTable.getAllTokens();
        return this.response.reply(allTokens);
    }

    /*	This function allows us to test our credentials to make sure they are working correctly.
     *
     *
     */
    async testCredentials() {
        const hasRequiredParameters = this.requiredParams(["refresh_token", ], ["lwa_client_id", "lwa_client_secret", "aws_secret_access_key", "aws_access_key_id", "selling_partner_role"]);

        try {
            var amz = new Amazon({
                region: 'na',
                refresh_token: this.body.refresh_token,
                ...this.config
            });
        } catch (err) {
            console.error("Unable to initialize the Amazon SP-API Wrapper Service", err);
        }

        var res = null;
        try {
            res = await amz.callAPI({
                operation: 'productPricing.getItemOffers',
                query: {
                    MarketplaceId: 'ATVPDKIKX0DER',
                    ItemType: "Asin",
                    ItemCondition: 'New'
                },
                path: {
                    'Asin': "B09B8DQ26F"
                }
            });

        } catch (err) {
            return this.errors.error("amazon-sp-api", err);
        }
        this.response.reply(res)
    }

    async  checkoutTokens(){
        const hasRequiredParameters = this.requiredParams(["requestedTokens"], []);
        if(hasRequiredParameters == false){
            return false;
        }

        const isCorrectType = this.typeCheck(this.body.requestedTokens, "integer");
        if(isCorrectType == false){
            return;
        }

        var checkedOutTokens = await this.amazonTokensTable.checkoutTokens(this.body.requestedTokens);
        return this.response.reply(checkedOutTokens);
    }

    async returnAllTokens(){
        var returnedTokens = await this.amazonTokensTable.returnAllTokens();
        if(returnedTokens)
            this.response.reply("All tokens returned");
        else
            this.errors.error("database", "Unable to return tokens");
    }

    async returnToken(){
        const hasRequiredParameters = this.requiredParams(["refreshToken"], []);
        if(hasRequiredParameters == false){
            return false;
        }

        var returnedTokens = await this.amazonTokensTable.returnToken(this.body.refreshToken);
        if(returnedTokens)
            this.response.reply("Token Returned");
        else
            this.errors.error("database", "Unable to return token");        
    }
}