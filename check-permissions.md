# Azure DevOps Pipeline Permissions Checklist

## 1. Agent Pool Permissions
- [ ] Go to Project Settings → Agent pools → Azure Pipelines
- [ ] Click Security tab
- [ ] Add "[Project Name] Build Service" with User permissions

## 2. Service Connection Permissions
- [ ] Go to Project Settings → Service connections
- [ ] Find "AIAutomation-service-connector"
- [ ] Click Security tab
- [ ] Ensure build service has access
- [ ] Verify Azure service principal has Contributor role

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

## Quick Fix Commands (if you have Azure CLI access):

```bash
# Check service principal permissions
az role assignment list --assignee [SERVICE_PRINCIPAL_ID] --scope /subscriptions/[SUBSCRIPTION_ID]

# Assign Contributor role if needed
az role assignment create --assignee [SERVICE_PRINCIPAL_ID] --role "Contributor" --scope /subscriptions/[SUBSCRIPTION_ID]
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
