Content Bounty is a MEAN Stack App

Frontend:	Angular
Backend:	Node.js, Express, Mongo

## Directory Structure ##

root
	api			This directory contains the node.js API
	client		This directory contains the Angular App
	docs		This directory contains the documentation
	howto		This is a directory that has quick 'how to's' for some common tasks
	processes	This directory contains .json files that i use to populate test data in Postman
	proxy		The directory is deprecated and will be deleted in the future
	public		Contains an HTML website.  Will be deleted from here in the future
	scrap		Scrap files that are needed for a temporary task.

deploy.sh		deprecated and will be removed
deploy2.sh		deprecated and will be removed
deploy_prod.sh	causes the project to be deployed to the production server.  only works if run on the server
project-create.sh	a script for setting up a git deployment

## Development Environment ##

To run this app locally, you need Angular 9, Mongo 4.0+, Node.js 14.15 installed.  If you are getting started
on a computer and you don't already have these prerequisitves installed, please follow the guide 
"setting up your development environment"

## Starting the node.js app ##

If you downloaded this project from a git repositry, it will not include a .env file -- which you will need
to get the project running.

Inside of the "environments/local" find a file called "environment.txt" and cut and paste its contents into
a .env file inside of the root directory.  

Then, open the root directory inside of terminal and run:

npm install

Then:

nodemon

