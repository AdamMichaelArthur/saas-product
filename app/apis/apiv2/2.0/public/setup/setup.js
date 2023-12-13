import { Base, ResponseError } from '@base'

export default class Setup extends Base {

	constructor(){
		super();
	}

	/* An empty endpoint to establish that the setup is working */
	test(){
		this.response.reply("Installation is working");
	}

	/* Sets up an initial user */
	setupRootUser(){
		
	}

}