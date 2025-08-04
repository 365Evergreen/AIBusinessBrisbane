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

## Step 3: Configure Federated Identity Credentials (CRITICAL!)

⚠️ **This is the most important step - without this, GitHub Actions will fail with OIDC authentication error**

1. **Go to Azure Portal** → **Microsoft Entra ID** → **App registrations**
2. **Find your app**: `github-actions-agentbuilder` (Client ID: `3feb91d8-029b-4500-82f1-ddd250637245`)
3. **Click on your app registration**
4. **Go to**: **Certificates & secrets** (in the left menu)
5. **Click**: **Federated credentials** tab
6. **Click**: **Add credential**
7. **Select**: **GitHub Actions deploying Azure resources**
8. **Fill in these EXACT values**:
   - **Organization**: `365Evergreen`
   - **Repository**: `AIBusinessBrisbane`
   - **Entity type**: `Branch`
   - **GitHub branch name**: `AgentBuilder`
   - **Name**: `github-agentbuilder-branch`
9. **Click**: **Add**

### Verify the Configuration Shows:
- **Issuer**: `https://token.actions.githubusercontent.com`
- **Subject**: `repo:365Evergreen/AIBusinessBrisbane:ref:refs/heads/AgentBuilder`
- **Audiences**: `api://AzureADTokenExchange`

### 🚨 Common Error:
If you see: `AADSTS70025: The client has no configured federated identity credentials`
- You skipped this step or made a typo in the repository/branch name

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

### Common Error: `AADSTS70025: The client has no configured federated identity credentials`
**Solution**: You need to configure federated credentials (Step 3 above)
- Verify the **exact** repository name: `AIBusinessBrisbane`
- Verify the **exact** organization: `365Evergreen`
- Verify the **exact** branch: `AgentBuilder`
- Make sure you selected "GitHub Actions deploying Azure resources"

### Common Error: `Interactive authentication is needed. Please run: az login`
**Solution**: Your workflow needs `auth-type: OIDC` parameter
- Check that your workflow has: `auth-type: OIDC` under the Azure login step

### Other Common Issues:
1. **Wrong subscription ID** - Double-check in Azure Portal
2. **Missing GitHub secrets** - Check that all 7 secrets are added
3. **App registration not found** - Make sure the Client ID matches exactly
4. **No Contributor permissions** - Verify the app has Contributor role on subscription

Your workflow will automatically:
- ✅ Build your React frontend
- ✅ Build your Azure Functions backend  
- ✅ Deploy Azure infrastructure (Static Web App, Function App, etc.)
- ✅ Deploy your application to Azure
