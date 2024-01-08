import { Base, ResponseError } from '@base'
import axios from 'axios';

export default class Slack extends Base {

	required_scopes = ['incoming-webhook','commands','chat:write','channels:history','groups:history','im:history','mpim:history','incoming-webhook'];

  constructor(){
    super();

  }

  authorize(){
    let state = this.user._id;
    let authorizeUrl = `https://slack.com/oauth/v2/authorize?state=${state}&redirect_uri=https://app.saas-product.com/v2.0/public/callbacks/slack/authorized&scope=${this.required_scopes.toString()}&client_id=${process.env.SLACK_APP_CLIENT_ID}`;
    this.response.reply(authorizeUrl);    
  }

  getAuthenticationUrl(){
    let state = this.user._id;
    let authorizeUrl = `https://slack.com/oauth/v2/authorize?state=${state}&redirect_uri=https://app.saas-product.com/v2.0/public/callbacks/slack/authorized&scope=${this.required_scopes.toString()}&client_id=${process.env.SLACK_APP_CLIENT_ID}`;
  	this.response.reply(authorizeUrl);
  }

  async saveToken(token ={}){
    this.ensurePath(this, ['user', 'slack']);
    this.user.slack.token = token;
    //this.inviteBotToChannel(token.incoming_webhook.channel_id);
  }
  

  /* In order for the integration to work properly, the bot needs to be invited to the channel */
  async inviteBotToChannel(channelId =''){

    let slackToken = this.user.slack.token;
    let token = slackToken.access_token;
    let userId = slackToken.bot_user_id;

    const config = {
      method: 'post',
      url: 'https://slack.com/api/conversations.invite',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      },
      data: {
        channel: channelId,
        users: userId
      }
    };

    console.log(52, config);

    axios.request(config)
      .then(function (response) {
        console.log(56, JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.error(59, error);
      });

  }
}




