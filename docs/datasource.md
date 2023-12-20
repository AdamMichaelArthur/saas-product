# The Datasource API

## The long overdo documentation for the datasource API

### Purpose
The datasource API's primary function is to provide paginated results for a MongoDB collection.  This enables sophisticated
front-end datatables that are backed by the database.  The result is the ability to take any MongoDB collection and interact
with that data in list form, with the backend handling all of the details associated with pagination, search, sort, and much
more.

Additionally, by default, the datasource only returns records that are owned by the currently logged in user.  There are three
scopes available to the developer: user, account and global.

When using the user scope, only records owned by the user are displayed

When using the account scope, all records owned by the account are returned.  Accounts can have multiple users

When using the global scope, all records are returned

## Basic Usage

### This is achieved through URL patterns.  All requests start with this format:
/datasource/COLLECTION_NAME

So, as an example, when deployed on a server, basic a request endpoint would look like this
https://app.saas-product.com/api/datasource/users

### The four basic operations: CRUD

The API supports five HTTP Methods: GET, POST, PUT, PATCH, DELETE

The URL Pattern for each method is
/datasource/{COLLECTION_NAME}


### Convention Notes
The datasource uses some conventions you should be aware of.

BASE_URL/datasource/COLLECTION_NAME
Accepts: An array of Objects
Result: bulk inserts the records into the database
Example: /datasource/bounties
[{
    "brand_name": "Watch Me Bark",
    "release_for_bounty":"2020-03-12T17:06:26.661Z",
    "queued_content":"Why Dogs Bark",
    "m_b":150,
    "spend":20,
    "c_b":25,
    "creator":"Angela",
    "creatorId":"5e047b6de1b28b023fe51db8",
    "content_type":"Long Form Article",
    "pipeline":"Unclaimed",
    "published":true,
    "keywords":["First Keyword", "Second Keyword", "Third Keyword", "Fourth Keyword"]
}]

### Create A Record
BASE_URL/datasource/COLLECTION_NAME
Accepts: An array of Objects
Result: bulk inserts the records into the database
Example: /datasource/bounties
{
    "brand_name": "Watch Me Bark",
    "release_for_bounty":"2020-03-12T17:06:26.661Z",
    "queued_content":"Why Dogs Bark",
    "m_b":150,
    "spend":20,
    "c_b":25,
    "creator":"Angela",
    "creatorId":"5e047b6de1b28b023fe51db8",
    "content_type":"Long Form Article",
    "pipeline":"Unclaimed",
    "published":true,
    "keywords":["First Keyword", "Second Keyword", "Third Keyword", "Fourth Keyword"]
]

### Delete A Record

### List A Record

GET /datasource/{COLLECTION_NAME}

Additional URL Parameters: max_records

You can control how many records are returned by providing a URL parameters 'max_records'

There default is 10.  If you pass max_records/0, it will return ALL of the records.  Generally not advisable,
but if you know with certainty a collection will only ever have a small number of documents and you don't want or 
need paginatiom, and you just want to pull the list...  Technically this only pulls the first 100000 records.  But
if you're trying to get a list of 100000, this isn't the appropriate way to get it.  



### Get a distinct list
/datasource/keywords/distinct/{key}

