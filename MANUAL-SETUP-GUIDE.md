# Manual Setup Guide for GitHub Actions (No Scripts Required)

## Step 1: Get Your Azure Information

1. **Open Azure Portal**: https://portal.azure.com
2. **Find your Subscription ID**:
   - Go to "Subscriptions" 
   - Copy your subscription ID

3. **Find your Tenant ID**:
   - Go to "Microsoft Entra ID" (formerly Azure AD)
   - Copy the "Tenant ID" from the overview page

## Step 2: Create App Registration (Azure Portal Method)

1. **Go to Azure Portal** → **Microsoft Entra ID** → **App registrations**
2. **Click "New registration"**
3. **Name**: `github-actions-agentbuilder-365evergreen`
4. **Account types**: Single tenant
5. **Click "Register"**
6. **Copy the "Application (client) ID"** - this is your `AZURE_CLIENT_ID`

## Step 3: Create Service Principal and Assign Permissions

1. **In your app registration**, go to **"Certificates & secrets"**
2. **Click "Federated credentials"** tab
3. **Click "Add credential"**
4. **Select "GitHub Actions deploying Azure resources"**
5. **Fill in**:
   - Organization: `365Evergreen`
   - Repository: `AIBusinessBrisbane`
   - Entity type: `Branch`
   - GitHub branch name: `AgentBuilder`
6. **Click "Add"**

7. **Repeat for other branches** (main, DemoSignUp) if needed

## Step 4: Assign Azure Permissions

1. **Go to your Azure Subscription**
2. **Click "Access control (IAM)"**
3. **Click "Add" → "Add role assignment"**
4. **Role**: Contributor
5. **Assign access to**: User, group, or service principal
6. **Select**: Search for `github-actions-agentbuilder-365evergreen`
7. **Click "Save"**

## Step 5: Add Secrets to GitHub

1. **Go to**: https://github.com/365Evergreen/AIBusinessBrisbane/settings/secrets/actions
2. **Click "New repository secret"** for each:

### Azure Secrets:
- **Name**: `AZURE_CLIENT_ID`, **Value**: [Your app client ID from Step 2]
- **Name**: `AZURE_TENANT_ID`, **Value**: [Your tenant ID from Step 1]
- **Name**: `AZURE_SUBSCRIPTION_ID`, **Value**: [Your subscription ID from Step 1]

### Dataverse Secrets (You should already have these values):
- **Name**: `DATAVERSE_CLIENT_ID`, **Value**: [Your Dataverse app ID]
- **Name**: `DATAVERSE_CLIENT_SECRET`, **Value**: [Your Dataverse app secret]
- **Name**: `DATAVERSE_TENANT_ID`, **Value**: [Your Dataverse tenant ID]
- **Name**: `DATAVERSE_RESOURCE`, **Value**: [Your Dataverse environment URL]

## Step 6: Test the Deployment

1. **Go to**: https://github.com/365Evergreen/AIBusinessBrisbane/actions
2. **Click on "Deploy Agent Builder to Azure" workflow**
3. **Click "Run workflow"**
4. **Select branch**: AgentBuilder
5. **Click "Run workflow"**

## ✅ That's It!

No access tokens needed - GitHub Actions and Azure OIDC handle all the authentication automatically!

## 🔍 If You Get Stuck:

The most common issues are:
1. **Wrong subscription ID** - Double-check in Azure Portal
2. **Federated credential not set up** - Make sure you added the GitHub branch correctly
3. **Missing Dataverse secrets** - Check that all 4 Dataverse secrets are added

Your workflow will automatically:
- ✅ Build your React frontend
- ✅ Build your Azure Functions backend  
- ✅ Deploy Azure infrastructure (Static Web App, Function App, etc.)
- ✅ Deploy your application to Azure
