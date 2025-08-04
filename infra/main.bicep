targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

@description('Name of the resource group')
param resourceGroupName string

@description('Dataverse Client ID')
param dataverseClientId string = ''

@description('Dataverse Client Secret')
@secure()
param dataverseClientSecret string = ''

@description('Dataverse Tenant ID')
param dataverseTenantId string = ''

@description('Dataverse Resource')
param dataverseResource string = ''

var resourceToken = uniqueString(subscription().id, location, environmentName)
var resourcePrefix = 'agb'

resource resourceGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
  tags: {
    'azd-env-name': environmentName
  }
}

module logAnalytics 'modules/logAnalytics.bicep' = {
  name: 'logAnalytics'
  scope: resourceGroup
  params: {
    name: 'az-${resourcePrefix}-${resourceToken}'
    location: location
    tags: {
      'azd-env-name': environmentName
    }
  }
}

module applicationInsights 'modules/applicationInsights.bicep' = {
  name: 'applicationInsights'
  scope: resourceGroup
  params: {
    name: 'az-${resourcePrefix}-${resourceToken}'
    location: location
    logAnalyticsWorkspaceId: logAnalytics.outputs.id
    tags: {
      'azd-env-name': environmentName
    }
  }
}

module managedIdentity 'modules/managedIdentity.bicep' = {
  name: 'managedIdentity'
  scope: resourceGroup
  params: {
    name: 'az-${resourcePrefix}-${resourceToken}'
    location: location
    tags: {
      'azd-env-name': environmentName
    }
  }
}

module keyVault 'modules/keyVault.bicep' = {
  name: 'keyVault'
  scope: resourceGroup
  params: {
    name: 'az-${resourcePrefix}-${resourceToken}'
    location: location
    tags: {
      'azd-env-name': environmentName
    }
  }
}

module staticWebApp 'modules/staticWebApp.bicep' = {
  name: 'staticWebApp'
  scope: resourceGroup
  params: {
    name: 'az-${resourcePrefix}-${resourceToken}'
    location: location
    applicationInsightsConnectionString: applicationInsights.outputs.connectionString
    dataverseClientId: dataverseClientId
    dataverseClientSecret: dataverseClientSecret
    dataverseTenantId: dataverseTenantId
    dataverseResource: dataverseResource
    tags: {
      'azd-env-name': environmentName
      'azd-service-name': 'agentbuilder-frontend'
    }
  }
}

module functionApp 'modules/functionApp.bicep' = {
  name: 'functionApp'
  scope: resourceGroup
  params: {
    name: 'az-${resourcePrefix}-${resourceToken}'
    location: location
    applicationInsightsConnectionString: applicationInsights.outputs.connectionString
    logAnalyticsWorkspaceId: logAnalytics.outputs.id
    managedIdentityId: managedIdentity.outputs.id
    managedIdentityPrincipalId: managedIdentity.outputs.principalId
    dataverseClientId: dataverseClientId
    dataverseClientSecret: dataverseClientSecret
    dataverseTenantId: dataverseTenantId
    dataverseResource: dataverseResource
    tags: {
      'azd-env-name': environmentName
      'azd-service-name': 'agentbuilder-backend'
    }
  }
}

output RESOURCE_GROUP_ID string = resourceGroup.id
output AZURE_STATIC_WEB_APPS_API_TOKEN string = staticWebApp.outputs.deploymentToken
output AZURE_FUNCTION_APP_NAME string = functionApp.outputs.name
output AZURE_STATIC_WEB_APP_NAME string = staticWebApp.outputs.name
