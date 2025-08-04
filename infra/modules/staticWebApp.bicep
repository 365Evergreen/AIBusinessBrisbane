param name string
param location string
param applicationInsightsConnectionString string
param dataverseClientId string
param dataverseClientSecret string
param dataverseTenantId string
param dataverseResource string
param tags object = {}

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: ''
    branch: 'main'
    buildProperties: {
      appLocation: '/agentbuilder-frontend'
      apiLocation: '/agentbuilder-backend'
      outputLocation: 'build'
    }
  }
}

resource staticWebAppConfig 'Microsoft.Web/staticSites/config@2023-12-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    APPLICATIONINSIGHTS_CONNECTION_STRING: applicationInsightsConnectionString
    DATAVERSE_CLIENT_ID: dataverseClientId
    DATAVERSE_CLIENT_SECRET: dataverseClientSecret
    DATAVERSE_TENANT_ID: dataverseTenantId
    DATAVERSE_RESOURCE: dataverseResource
  }
}

output id string = staticWebApp.id
output name string = staticWebApp.name
output deploymentToken string = listSecrets(staticWebApp.id, staticWebApp.apiVersion).properties.apiKey
output defaultHostname string = staticWebApp.properties.defaultHostname
