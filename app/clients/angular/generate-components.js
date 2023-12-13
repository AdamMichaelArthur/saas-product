const fs = require('fs');
const { exec } = require('child_process');

// Specify the number of child components to generate
const numComponents = 5;

// Specify the path of the main component
const mainComponentPath = './src/app/main/main.component.ts';

// Specify the relative path of the content directory
const contentDirectory = './src/app/main/content/';

// Read the main component file
fs.readFile(mainComponentPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading main component file:', err);
    return;
  }

  // Extract the existing child component imports
  const existingImports = data.match(/import\s+{([^}]*)}/)?.[0] || '';

  // Generate new child component imports and components array
  const newImports = [];
  const componentsArray = [];
  for (let i = 1; i <= numComponents; i++) {
    const componentName = `Child${i}Component`;
    const componentImport = `import { ${componentName} } from '${contentDirectory}child${i}/child${i}.component';`;
    const componentDeclaration = `${componentName},`;
    newImports.push(componentImport);
    componentsArray.push(componentDeclaration);
  }

  // Update the main component file with new child component imports and components array
  const updatedData = data
    .replace(existingImports, `${existingImports}\n${newImports.join('\n')}`)
    .replace(/(children:\s*\[[^]*])/m, `$1\n  ${componentsArray.join('\n  ')}`);

  // Write the updated main component file
  fs.writeFile(mainComponentPath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing main component file:', err);
      return;
    }

    console.log('Main component file updated successfully.');

    // Generate the child components using Angular CLI
    exec(`ng generate component ${contentDirectory}child{1..${numComponents}}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error generating child components:', error);
        return;
      }

      console.log('Child components generated successfully.');

      console.log(stdout);
      console.error(stderr);
    });
  });
});

