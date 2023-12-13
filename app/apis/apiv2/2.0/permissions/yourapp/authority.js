//import Account from "@permissions/account/account.js"

export default class AuthorityPermissions {

	navigationMenuItems = [];

	constructor(){

		this.inheritParentMenus = false;
		var navigationMenuItems = [];
		var navigationMenuItems = [
			{
				title: "Authorty Permissions Example",
				route: "/example",
				permissions: "sysadmin",
				path: "queue",
   			 icon: "description",
   			 collapse: "autobot", 
   			 	priority: 40
			}
		]

		this.navigationMenuItems = navigationMenuItems
	}
}