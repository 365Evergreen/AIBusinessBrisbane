Create an Azure static web app that allows visitors to view a gallery of products that we have on offer. The products are Personal assistant agent, Lead generator (with follow up actions), Human Resources agent. 

When a customer selects a product, they can complete a form that populate variables in a prewritten prompt and generates a demonstration of the service. 

The prompts will be stored in Dataverse and all client registrations will be stored in Dataverse

Dataverse environment: orgefecd8a9.crm6.dynamics.com

<fetch top="50">
  <entity name="e365_agentknowledgearticle">
    <attribute name="createdby" />
    <attribute name="createdon" />
    <attribute name="createdonbehalfby" />
    <attribute name="e365_agentknowledgearticleid" />
    <attribute name="e365_name" />
    <attribute name="e365_role" />
    <attribute name="e365_taskdescription" />
    <attribute name="importsequencenumber" />
    <attribute name="modifiedby" />
    <attribute name="modifiedon" />
    <attribute name="modifiedonbehalfby" />
    <attribute name="overriddencreatedon" />
    <attribute name="ownerid" />
    <attribute name="owningbusinessunit" />
    <attribute name="statecode" />
    <attribute name="statuscode" />
    <attribute name="timezoneruleversionnumber" />
    <attribute name="utcconversiontimezonecode" />
    <attribute name="versionnumber" />
  </entity>
</fetch>

<fetch top="50">
  <entity name="e365_contactformsubmission">
    <attribute name="createdby" />
    <attribute name="createdon" />
    <attribute name="createdonbehalfby" />
    <attribute name="e365_name" />
    <attribute name="importsequencenumber" />
    <attribute name="modifiedby" />
    <attribute name="modifiedon" />
    <attribute name="modifiedonbehalfby" />
    <attribute name="overriddencreatedon" />
    <attribute name="ownerid" />
    <attribute name="owningbusinessunit" />
    <attribute name="statecode" />
    <attribute name="statuscode" />
    <attribute name="timezoneruleversionnumber" />
    <attribute name="utcconversiontimezonecode" />
    <attribute name="versionnumber" />
    <attribute name="e365_agentrequested" />
    <attribute name="e365_companyname" />
    <attribute name="e365_contactformsubmissionid" />
    <attribute name="e365_email" />
    <attribute name="e365_firstname" />
    <attribute name="e365_phoneno" />
    <attribute name="e365_surname" />
  </entity>
</fetch>

<fetch top="50">
  <entity name="e365_prompt">
    <attribute name="createdby" />
    <attribute name="createdon" />
    <attribute name="createdonbehalfby" />
    <attribute name="e365_agent" />
    <attribute name="e365_name" />
    <attribute name="e365_priorities" />
    <attribute name="e365_prompt" />
    <attribute name="e365_promptid" />
    <attribute name="e365_relatedknowledge" />
    <attribute name="e365_role" />
    <attribute name="importsequencenumber" />
    <attribute name="modifiedby" />
    <attribute name="modifiedon" />
    <attribute name="modifiedonbehalfby" />
    <attribute name="overriddencreatedon" />
    <attribute name="ownerid" />
    <attribute name="owningbusinessunit" />
    <attribute name="statecode" />
    <attribute name="statuscode" />
    <attribute name="timezoneruleversionnumber" />
    <attribute name="utcconversiontimezonecode" />
    <attribute name="versionnumber" />
  </entity>
</fetch>

For example, a PA can enter the name of their company, choose from a list of priorities and a workflow will populate the prompt and create a working demo 

Additional pages are: personal-assist.html, lead-generator.html, hr-agent.html, services.html