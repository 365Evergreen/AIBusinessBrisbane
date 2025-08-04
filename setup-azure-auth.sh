#!/bin/bash

# Azure Setup Script for GitHub Actions
# Run this script to set up Azure authentication for your Agent Builder deployment

echo "🚀 Setting up Azure authentication for Agent Builder GitHub Actions..."

# Login to Azure
echo "📝 Logging into Azure..."
az login

# Get Azure information
echo "📋 Getting Azure account information..."
subscriptionId=$(az account show --query id -o tsv)
tenantId=$(az account show --query tenantId -o tsv)

echo "✅ Subscription ID: $subscriptionId"
echo "✅ Tenant ID: $tenantId"

# Create app registration
echo "🔐 Creating app registration for GitHub Actions..."
az ad app create --display-name "github-actions-agentbuilder-365evergreen"

# Get the app ID
appId=$(az ad app list --display-name "github-actions-agentbuilder-365evergreen" --query "[0].appId" -o tsv)
echo "✅ Azure Client ID: $appId"

# Create service principal
echo "👤 Creating service principal..."
az ad sp create --id $appId

# Add Contributor role
echo "🔑 Assigning Contributor role..."
az role assignment create --assignee $appId --role Contributor --scope /subscriptions/$subscriptionId

# Create federated credentials for GitHub branches
echo "🔗 Creating federated credentials for GitHub branches..."

# Main branch
az ad app federated-credential create \
  --id $appId \
  --parameters '{
    "name": "github-actions-main",
    "issuer": "https://token.actions.githubusercontent.com", 
    "subject": "repo:365Evergreen/AIBusinessBrisbane:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# DemoSignUp branch
az ad app federated-credential create \
  --id $appId \
  --parameters '{
    "name": "github-actions-demosignup",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:365Evergreen/AIBusinessBrisbane:ref:refs/heads/DemoSignUp", 
    "audiences": ["api://AzureADTokenExchange"]
  }'

# AgentBuilder branch
az ad app federated-credential create \
  --id $appId \
  --parameters '{
    "name": "github-actions-agentbuilder",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:365Evergreen/AIBusinessBrisbane:ref:refs/heads/AgentBuilder", 
    "audiences": ["api://AzureADTokenExchange"]
  }'

echo ""
echo "🎉 Azure authentication setup complete!"
echo ""
echo "📝 Add these secrets to your GitHub repository:"
echo "   Go to: https://github.com/365Evergreen/AIBusinessBrisbane/settings/secrets/actions"
echo ""
echo "   AZURE_CLIENT_ID: $appId"
echo "   AZURE_TENANT_ID: $tenantId"
echo "   AZURE_SUBSCRIPTION_ID: $subscriptionId"
echo ""
echo "   You'll also need to add these Dataverse secrets:"
echo "   DATAVERSE_CLIENT_ID: [Your Dataverse app client ID]"
echo "   DATAVERSE_CLIENT_SECRET: [Your Dataverse app secret]"
echo "   DATAVERSE_TENANT_ID: [Your Dataverse tenant ID]"
echo "   DATAVERSE_RESOURCE: [Your Dataverse environment URL]"
echo ""
echo "🚀 Once secrets are added, your GitHub Actions workflow will automatically deploy to Azure!"
echo "   Workflow URL: https://github.com/365Evergreen/AIBusinessBrisbane/actions"
