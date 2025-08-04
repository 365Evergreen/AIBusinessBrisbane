const AuthenticationContext = require('adal-node').AuthenticationContext;
const fetch = require('node-fetch');

const dataverseUrl = process.env.DATAVERSE_URL;
const clientId = process.env.DATAVERSE_CLIENT_ID;
const clientSecret = process.env.DATAVERSE_CLIENT_SECRET;
const tenantId = process.env.DATAVERSE_TENANT_ID;

const authorityUrl = `https://login.microsoftonline.com/${tenantId}`;
const resource = dataverseUrl;

async function getToken() {
    return new Promise((resolve, reject) => {
        const context = new AuthenticationContext(authorityUrl);
        context.acquireTokenWithClientCredentials(resource, clientId, clientSecret, (err, tokenResponse) => {
            if (err) {
                reject(err);
            } else {
                resolve(tokenResponse.accessToken);
            }
        });
    });
}

module.exports = async function (context, req) {
    context.log('RegisterClient HTTP trigger function processed a request.');

    const { companyName, email, firstName, surname, phoneNo, agentRequested } = req.body;

    if (!companyName || !email || !firstName || !surname || !phoneNo || !agentRequested) {
        context.res = {
            status: 400,
            body: "Please provide all required fields: companyName, email, firstName, surname, phoneNo, agentRequested."
        };
        return;
    }

    try {
        const accessToken = await getToken();
        const record = {
            "e365_companyname": companyName,
            "e365_email": email,
            "e365_firstname": firstName,
            "e365_surname": surname,
            "e365_phoneno": phoneNo,
            "e365_agentrequested": agentRequested
        };

        const url = `${dataverseUrl}/api/data/v9.1/e365_contactformsubmissions`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Accept': 'application/json'
            },
            body: JSON.stringify(record)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create record in Dataverse: ${response.statusText} - ${errorText}`);
        }

        context.res = {
            status: 201,
            body: "Client registration successful."
        };

    } catch (error) {
        context.log.error('Error registering client:', error);
        context.res = {
            status: 500,
            body: `Failed to register client: ${error.message}`
        };
    }
};