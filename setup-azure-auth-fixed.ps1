# Azure Setup Script for GitHub Actions (PowerShell version)
# Run this script to set up Azure authentication for your Agent Builder deployment

Write-Host "🚀 Setting up Azure authentication for Agent Builder GitHub Actions..." -ForegroundColor Green

# Login to Azure
Write-Host "📝 Logging into Azure..." -ForegroundColor Yellow
az login

# Get Azure information
Write-Host "📋 Getting Azure account information..." -ForegroundColor Yellow
$subscriptionId = az account show --query id -o tsv
$tenantId = az account show --query tenantId -o tsv

Write-Host "✅ Subscription ID: $subscriptionId" -ForegroundColor Green
Write-Host "✅ Tenant ID: $tenantId" -ForegroundColor Green

# Create app registration
Write-Host "🔐 Creating app registration for GitHub Actions..." -ForegroundColor Yellow
az ad app create --display-name "github-actions-agentbuilder-365evergreen"

# Get the app ID
$appId = az ad app list --display-name "github-actions-agentbuilder-365evergreen" --query "[0].appId" -o tsv
Write-Host "✅ Azure Client ID: $appId" -ForegroundColor Green

# Create service principal
Write-Host "👤 Creating service principal..." -ForegroundColor Yellow
az ad sp create --id $appId

# Add Contributor role
Write-Host "🔑 Assigning Contributor role..." -ForegroundColor Yellow
az role assignment create --assignee $appId --role Contributor --scope "/subscriptions/$subscriptionId"

# Create federated credentials for GitHub branches
Write-Host "🔗 Creating federated credentials for GitHub branches..." -ForegroundColor Yellow

# Main branch
$mainCredential = @"
{
  "name": "github-actions-main",
  "issuer": "https://token.actions.githubusercontent.com", 
  "subject": "repo:365Evergreen/AIBusinessBrisbane:ref:refs/heads/main",
  "audiences": ["api://AzureADTokenExchange"]
}
"@

az ad app federated-credential create --id $appId --parameters $mainCredential

# DemoSignUp branch
$demoCredential = @"
{
  "name": "github-actions-demosignup",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:365Evergreen/AIBusinessBrisbane:ref:refs/heads/DemoSignUp", 
  "audiences": ["api://AzureADTokenExchange"]
}
"@

az ad app federated-credential create --id $appId --parameters $demoCredential

# AgentBuilder branch
$agentCredential = @"
{
  "name": "github-actions-agentbuilder",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:365Evergreen/AIBusinessBrisbane:ref:refs/heads/AgentBuilder", 
  "audiences": ["api://AzureADTokenExchange"]
}
"@

az ad app federated-credential create --id $appId --parameters $agentCredential

Write-Host ""
Write-Host "🎉 Azure authentication setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Add these secrets to your GitHub repository:" -ForegroundColor Cyan
Write-Host "   Go to: https://github.com/365Evergreen/AIBusinessBrisbane/settings/secrets/actions" -ForegroundColor Cyan
Write-Host ""
Write-Host "   AZURE_CLIENT_ID: $appId" -ForegroundColor Yellow
Write-Host "   AZURE_TENANT_ID: $tenantId" -ForegroundColor Yellow
Write-Host "   AZURE_SUBSCRIPTION_ID: $subscriptionId" -ForegroundColor Yellow
Write-Host ""
Write-Host "   You will also need to add these Dataverse secrets:" -ForegroundColor Cyan
Write-Host "   DATAVERSE_CLIENT_ID: [Your Dataverse app client ID]" -ForegroundColor Yellow
Write-Host "   DATAVERSE_CLIENT_SECRET: [Your Dataverse app secret]" -ForegroundColor Yellow
Write-Host "   DATAVERSE_TENANT_ID: [Your Dataverse tenant ID]" -ForegroundColor Yellow
Write-Host "   DATAVERSE_RESOURCE: [Your Dataverse environment URL]" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Once secrets are added, your GitHub Actions workflow will automatically deploy to Azure!" -ForegroundColor Green
Write-Host "   Workflow URL: https://github.com/365Evergreen/AIBusinessBrisbane/actions" -ForegroundColor Cyan
