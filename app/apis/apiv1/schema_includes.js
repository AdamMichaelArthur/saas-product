module.exports = function(app)
{
 require("@models/rolesSchema.js");
 require("@models/accountsSchema.js")
 require("@models/routesSchema.js");
 require("@models/userSchema.js");

require("@models/imagesSchema.js");

require("@ecommerce/ordersSchema.js");

require("@ecommerce/productsSchema.js");

require("@ecommerce/customersSchema.js");

require("@models/financials/financialsSchema.js");

require("@models/hugo/hugoSchema.js");

require("@models/navigation/navigationSchema.js");

require("@models/test/testSchema.js");

require("@models/email/emailSchema.js");

require("@models/newTriggersSchema.js");

require("@models/logging/loggingSchema.js");


//require("../api/models/zzendpointzzSchema.js");

}
