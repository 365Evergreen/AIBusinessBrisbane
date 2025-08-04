// Main index.js file for Azure Functions
// This file routes to the appropriate function based on the binding

const registerClient = require('./RegisterClient/index.js');
const generateDemo = require('./GenerateDemo/index.js');

module.exports = {
    RegisterClient: registerClient,
    GenerateDemo: generateDemo
};
