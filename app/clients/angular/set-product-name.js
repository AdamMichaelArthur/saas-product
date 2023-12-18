const fs = require('fs');

const path = '../../apis/apiv2/.env';

var productName = "";
try {
  const data = fs.readFileSync(path, 'utf8');
  const lines = data.split('\n');
  
  for (let line of lines) {
    if (line.trim() === '') continue; // Skip empty lines

    const parts = line.split('=');
    if (parts.length === 2) {
      const key = parts[0].trim();
      const value = parts[1].trim();
      process.env[key] = value;  // Set the environment variable
    }
  }

  // Now you can use the environment variables
  // For example:
  productName = process.env.PRODUCT_NAME;

  console.log(process.env.PRODUCT_NAME);
  
} catch (err) {
  console.error(err);
}

const indexPath = './dist/saas-product/index.html';

fs.readFile(indexPath, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/%%PRODUCT_NAME%%/g, productName);

  fs.writeFile(indexPath, result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
