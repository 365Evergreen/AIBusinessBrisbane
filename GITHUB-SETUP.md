# GitHub Actions Migration Guide for AIBusinessBrisbane

## Repository: https://github.com/365Evergreen/AIBusinessBrisbane

## Step 1: Create Agent Builder Branch

We'll create a new branch called `AgentBuilder` for your Agent Builder application:

```bash
# Create and switch to AgentBuilder branch
git checkout -b AgentBuilder

# Push to GitHub
git push github AgentBuilder
```

## Step 2: Set up Azure Authentication (OIDC - No Service Principal Needed!)

GitHub Actions uses **OpenID Connect (OIDC)** to authenticate with Azure, which is much easier than service principals.

### 3.1: Create Azure App Registration

Run these commands in Azure CLI (or use Azure Portal):

```bash
# Login to Azure
az login

# Create app registration for GitHub Actions
az ad app create --display-name "github-actions-agentbuilder"

# Get the app ID (you'll need this)
appId=$(az ad app list --display-name "github-actions-agentbuilder" --query "[0].appId" -o tsv)
echo "AZURE_CLIENT_ID: $appId"

# Get your tenant ID
tenantId=$(az account show --query tenantId -o tsv)
echo "AZURE_TENANT_ID: $tenantId"

# Get your subscription ID  
subscriptionId=$(az account show --query id -o tsv)
echo "AZURE_SUBSCRIPTION_ID: $subscriptionId"

# Create service principal
az ad sp create --id $appId

# Add Contributor role to the service principal
az role assignment create --assignee $appId --role Contributor --scope /subscriptions/$subscriptionId
```

### 3.2: Configure Federated Credentials for GitHub

```bash
### 3.2: Configure Federated Credentials for GitHub

```bash
# Create federated credential for main branch
az ad app federated-credential create \
  --id $appId \
  --parameters '{
    "name": "github-actions-main",
    "issuer": "https://token.actions.githubusercontent.com", 
    "subject": "repo:365Evergreen/AIBusinessBrisbane:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# Create federated credential for DemoSignUp branch
az ad app federated-credential create \
  --id $appId \
  --parameters '{
    "name": "github-actions-demosignup",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:365Evergreen/AIBusinessBrisbane:ref:refs/heads/DemoSignUp", 
    "audiences": ["api://AzureADTokenExchange"]
  }'

# Create federated credential for AgentBuilder branch
az ad app federated-credential create \
  --id $appId \
  --parameters '{
    "name": "github-actions-agentbuilder",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:365Evergreen/AIBusinessBrisbane:ref:refs/heads/AgentBuilder", 
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

## Step 4: Configure GitHub Secrets

In your GitHub repository, go to **Settings → Secrets and variables → Actions**

Add these **Repository secrets**:

### Required Azure Secrets:
- `AZURE_CLIENT_ID`: [App ID from step 3.1]
- `AZURE_TENANT_ID`: [Tenant ID from step 3.1]  
- `AZURE_SUBSCRIPTION_ID`: [Subscription ID from step 3.1]

### Required Dataverse Secrets:
- `DATAVERSE_CLIENT_ID`: [Your Dataverse app client ID]
- `DATAVERSE_CLIENT_SECRET`: [Your Dataverse app secret]
- `DATAVERSE_TENANT_ID`: [Your Dataverse tenant ID]
- `DATAVERSE_RESOURCE`: [Your Dataverse environment URL]

## Step 5: Run the Workflow

1. Push your code to GitHub
2. Go to **Actions** tab in your GitHub repository
3. The workflow will automatically run on push to main/master/AIAutomation branches
4. Or click **Run workflow** to trigger manually

## Advantages of GitHub Actions over Azure DevOps:

✅ **No service connections to configure**
✅ **OIDC authentication is more secure**
✅ **Simpler permission management**
✅ **Better Git integration**
✅ **Free minutes for public repositories**
✅ **No parallel job limitations**
✅ **Easier debugging with better logs**

## Migration Complete!

Once you complete these steps, you'll have:
- ✅ Automated builds for React frontend and Azure Functions backend
- ✅ Infrastructure deployment using Bicep
- ✅ Secure Azure authentication using OIDC
- ✅ Deployment to Azure Static Web Apps and Function Apps
