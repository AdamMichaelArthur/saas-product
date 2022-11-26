
export default class Person {
	
	constructor(firstName, lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
	}

	display() {
		console.log(this.firstName + " " + this.lastName);
	}
}
