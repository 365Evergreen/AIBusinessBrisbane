# Agent Builder Deployment Config

This configuration file contains all the settings and information needed to deploy your Agent Builder app to Azure using GitHub Actions.

## Quick Setup Checklist

### ☐ Azure Setup
1. **Get Azure Information** (from config: `azure.subscription` and `azure.tenant`)
   - Subscription ID: Go to Azure Portal → Subscriptions
   - Tenant ID: Go to Azure Portal → Microsoft Entra ID

2. **Create App Registration** (from config: `azure.appRegistration`)
   - Name: `github-actions-agentbuilder`
   - Copy the Client ID when created

3. **Set up Federated Credentials** (from config: `federatedCredentials`)
   - Use the exact subjects listed in the config file
   - Issuer: `https://token.actions.githubusercontent.com`
   - Audiences: `["api://AzureADTokenExchange"]`

### ☐ GitHub Setup
4. **Add GitHub Secrets** (from config: `github.secrets.required`)
   - Go to: https://github.com/365Evergreen/AIBusinessBrisbane/settings/secrets/actions
   - Add all 7 required secrets listed in the config

### ☐ Deploy
5. **Run Workflow** (from config: `deployment.workflow`)
   - Go to: https://github.com/365Evergreen/AIBusinessBrisbane/actions
   - Run "Deploy Agent Builder to Azure" workflow

## Configuration Details

The `deployment-config.json` file contains:

- ✅ **Azure resource names and locations**
- ✅ **GitHub repository and branch information**
- ✅ **Required secrets with descriptions and sources**
- ✅ **Federated credential configuration**
- ✅ **Deployment targets and stages**
- ✅ **Quick reference links**

## Using the Config File

### Option 1: Reference Guide
Use the config file as a reference while following the manual setup steps.

### Option 2: Automated Setup (Advanced)
If you're comfortable with Azure CLI, you could use the config to automate the setup:

```bash
# Example: Create app registration with name from config
$config = Get-Content deployment-config.json | ConvertFrom-Json
az ad app create --display-name $config.azure.appRegistration.name
```

## Files Created for Your Deployment

1. **deployment-config.json** - This configuration file
2. **.github/workflows/deploy.yml** - GitHub Actions workflow
3. **infra/main.bicep** - Azure infrastructure template
4. **MANUAL-SETUP-GUIDE.md** - Step-by-step setup instructions

## Next Steps

1. **Fill in your values** in the config file (optional)
2. **Follow the setup checklist** above
3. **Deploy your app** using GitHub Actions

Your Agent Builder will be deployed to:
- **Frontend**: Azure Static Web Apps
- **Backend**: Azure Functions
- **Infrastructure**: Automatically provisioned via Bicep
