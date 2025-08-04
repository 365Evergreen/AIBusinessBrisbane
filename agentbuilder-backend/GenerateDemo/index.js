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

async function getPromptTemplate(product, priorities) {
    const accessToken = await getToken();
    const fetchXml = `<fetch top="1">
                        <entity name="e365_prompt">
                            <attribute name="e365_prompt" />
                            <filter type="and">
                                <condition attribute="e365_agent" operator="eq" value="${product}" />
                                <condition attribute="e365_priorities" operator="eq" value="${priorities}" />
                            </filter>
                        </entity>
                    </fetch>`;

    const encodedFetchXml = encodeURIComponent(fetchXml);
    const url = `${dataverseUrl}/api/data/v9.1/e365_prompts?fetchXml=${encodedFetchXml}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch prompt from Dataverse: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.value && data.value.length > 0) {
        return data.value[0]["e365_prompt"];
    } else {
        return null;
    }
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const product = (req.query.product || (req.body && req.body.product));
    const formData = (req.body && req.body.formData);

    let promptTemplate = '';
    let demo = '';

    if (!product || !formData) {
        context.res = {
            status: 400,
            body: "Please pass a product and form data in the request body or query string."
        };
        return;
    }

    try {
        if (product === 'pa') {
            const companyName = formData.companyName;
            const priorities = formData.priorities;
            promptTemplate = await getPromptTemplate(product, priorities);
            if (promptTemplate) {
                demo = `PA Demo for ${companyName}: Focusing on ${priorities} tasks. Prompt: ${promptTemplate.replace('{companyName}', companyName).replace('{priorities}', priorities)}`;
            } else {
                demo = `PA Demo for ${companyName}: Focusing on ${priorities} tasks. No specific prompt found.`;
            }
        } else if (product === 'leadgen') {
            const industry = formData.industry;
            const targetAudience = formData.targetAudience;
            promptTemplate = await getPromptTemplate(product, null); // Assuming no priorities for leadgen
            if (promptTemplate) {
                demo = `Lead Gen Demo for ${industry}: Targeting ${targetAudience}. Prompt: ${promptTemplate.replace('{industry}', industry).replace('{targetAudience}', targetAudience)}`;
            } else {
                demo = `Lead Gen Demo for ${industry}: Targeting ${targetAudience}. No specific prompt found.`;
            }
        } else if (product === 'hr') {
            const hrTask = formData.hrTask;
            promptTemplate = await getPromptTemplate(product, hrTask); // Assuming hrTask maps to priorities
            if (promptTemplate) {
                demo = `HR Agent Demo for ${hrTask} tasks. Prompt: ${promptTemplate.replace('{hrTask}', hrTask)}`;
            } else {
                demo = `HR Agent Demo for ${hrTask} tasks. No specific prompt found.`;
            }
        }

        context.res = {
            status: 200,
            body: {
                prompt: promptTemplate,
                demo: demo
            }
        };
    } catch (error) {
        context.log.error('Error generating demo:', error);
        context.res = {
            status: 500,
            body: `Failed to generate demo: ${error.message}`
        };
    }
};