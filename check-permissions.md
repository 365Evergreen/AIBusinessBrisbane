# Azure DevOps Pipeline Permissions Checklist

## 1. Agent Pool Permissions
- [ ] Go to Project Settings → Agent pools → Azure Pipelines
- [ ] Click Security tab
- [ ] Add "[Project Name] Build Service" with User permissions

## 2. Service Connection Setup (No Azure Service Principal Required!)
### Option A: If AIAutomation-service-connector doesn't exist, create it:
- [ ] Go to Project Settings → Service connections
- [ ] Click "New service connection"
- [ ] Select "Azure Resource Manager"
- [ ] Choose "Service principal (automatic)" - Azure DevOps will create it for you
- [ ] Name it "AIAutomation-service-connector"
- [ ] Select your subscription and resource group
- [ ] Azure DevOps handles the service principal creation automatically

### Option B: If AIAutomation-service-connector exists:
- [ ] Go to Project Settings → Service connections
- [ ] Find "AIAutomation-service-connector"
- [ ] Click Security tab
- [ ] Ensure build service has access
- [ ] The service principal is automatically managed by Azure DevOps

## 3. Repository Permissions
- [ ] Go to Project Settings → Repositories → AI Automation
- [ ] Click Security tab
- [ ] Grant "[Project Name] Build Service" Read permissions

## 4. Variable Group Permissions
- [ ] Go to Pipelines → Library
- [ ] Find "AIAutomationVariableGroup"
- [ ] Click Security tab
- [ ] Add pipeline with User permissions

## 5. Pipeline Permissions
- [ ] Go to Pipelines → Your pipeline
- [ ] Click Edit → More actions → Security
- [ ] Ensure proper permissions are set

## Quick Steps to Create Service Connection (Azure DevOps will handle the service principal):

### Step-by-Step Service Connection Creation:
1. Go to your Azure DevOps project: https://dev.azure.com/365EvergreenSolutions/AI%20Automation
2. Click the gear icon (Project Settings) in bottom left
3. Under "Pipelines", click "Service connections"
4. Click "Create service connection"
5. Select "Azure Resource Manager"
6. Choose "Service principal (automatic)" - **Azure DevOps creates the service principal for you**
7. Select your Azure subscription
8. For Resource group, select or create: `rg-agentbuilder-dev`
9. Name the service connection: `AIAutomation-service-connector`
10. Click "Save"

Azure DevOps will automatically:
- Create the service principal in Azure AD
- Assign it the Contributor role to your subscription/resource group
- Configure all the authentication details

## Alternative: Use Workload Identity (Recommended for new setups):

```bash
# No manual service principal needed - Azure DevOps handles everything
```

## Common Error Messages and Solutions:

### "The pipeline is not valid. Job 'BuildFrontend' could not be started because it has no agent pool."
**Solution**: Check Agent Pool permissions (#1 above)

### "##[error]No service connection found with name 'AIAutomation-service-connector'"
**Solution**: Check Service Connection permissions (#2 above)

### "##[error]Variable group 'AIAutomationVariableGroup' could not be found"
**Solution**: Check Variable Group permissions (#4 above)

### "The user lacks permission to execute this action"
**Solution**: Check Repository permissions (#3 above)
