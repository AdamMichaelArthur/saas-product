import Base from '../../../classes/Base/base.js'

export default class FrontendAnalytics extends Base {

	constructor(initializers =null, route ='', className =''){
		 super(initializers, "/public/frontend-analytics", "frontend-analytics");
	}

	async beacon(){

		const hasRequiredParameters = this.requiredParams(["user_id", "type", "page", "action", "action_id", "email"], ["asin", "dateRange", "keyword", "project_id", "actionStart", "actionComplete", "actionTotalTime"]);
		if(!hasRequiredParameters){
			return;
		}

		if(this.body.actionComplete == ""){
			this.body.actionComplete = null;
		}

		if(this.body.actionTotalTime == 0){
			this.body.actionTotelTime = null;
		}

		console.log(24, this.body.asin);
		if(this.body.actionStart == false)
			this.body.actionStart = null;

		if(this.body.actionComplete == false)
			this.body.actionComplete = null;

		if(this.body.actionComplete == false)
			this.body.actionComplete = null;

		if(this.body.dateRange == false)
			this.body.dateRange = null;

		if(this.body.actionTotalTime == false)
			this.body.actionTotalTime = null;

		if(this.body.keyword == false)
			this.body.keyword = null;

		if(this.body.project_id == false)
			this.body.project_id = null;

		var result = await this.database.tables.frontendAnalytics.createBeacon(this.body);
		if(result == false){
			return this.errors.error("beacon", "beacon cannot be saved");
		}

		this.response.reply( result[0].dataValues )

	}

}
