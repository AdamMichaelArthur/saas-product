/*
    Helps get new SaaS Product Installations up and running
*/

export default class Setup extends Base {

  constructor(){
    super();
  }

  async registerDatabaseAndUser(dbName ="", dbUser ="", dbPass =""){

    let adminDb = global.db.db("admin");

    try {
    const userCreationResult = await db.command({
      createUser: dbUser,
      pwd: dbPass,
      roles: [{
        role: "dbOwner",
          db: dbName
      }]
    });

      
    } catch(err){
      return false;
    }

    this.response.reply("Database, Username and Password Created");

  }



}