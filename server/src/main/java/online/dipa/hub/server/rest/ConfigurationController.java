package online.dipa.hub.server.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import online.dipa.hub.api.model.MilestoneTemplate;
import online.dipa.hub.api.model.PlanTemplate;
import online.dipa.hub.api.rest.ConfigurationApi;
import online.dipa.hub.services.ConfigurationService;

@RestApiController
public class ConfigurationController implements ConfigurationApi {

    @Autowired
    private ConfigurationService configurationService;

    @PreAuthorize("hasRole('ROLE_PMO')")
    @Override
    public ResponseEntity<List<MilestoneTemplate>> getMilestoneTemplates(final Long planTemplateId) {
        List<MilestoneTemplate> milestoneTemplates =  configurationService.getMilestoneTemplates(planTemplateId);
        return ResponseEntity.ok(milestoneTemplates);
    }

    @PreAuthorize("hasRole('ROLE_PMO')")
    @Override
    public ResponseEntity<MilestoneTemplate> createMilestoneTemplate(final Long planTemplateId, final MilestoneTemplate milestoneTemplate) {
        MilestoneTemplate newMilestoneTemplate = configurationService.createMilestoneTemplate(planTemplateId, milestoneTemplate);
        return ResponseEntity.ok(newMilestoneTemplate);
    }

    @PreAuthorize("hasRole('ROLE_PMO')")
    @Override
    public ResponseEntity<Void> deleteMilestoneTemplate(final Long id) {
        configurationService.deleteMilestoneTemplate(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ROLE_PMO')")
    @Override
    public ResponseEntity<List<PlanTemplate>> getPlanTemplates() {
        List<PlanTemplate> planTemplates =  configurationService.getPlanTemplates();
        return ResponseEntity.ok(planTemplates);
    }

    @PreAuthorize("hasRole('ROLE_PMO')")
    @Override
    public ResponseEntity<PlanTemplate> createPlanTemplate(final PlanTemplate planTemplate) {
        PlanTemplate newPlanTemplate = configurationService.createPlanTemplate(planTemplate);
        return ResponseEntity.ok(newPlanTemplate);
    }

    @PreAuthorize("hasRole('ROLE_PMO')")
    @Override
    public ResponseEntity<Void> deletePlanTemplate(final Long planTemplateId) {
        configurationService.deletePlanTemplate(planTemplateId);
        return ResponseEntity.noContent().build();
    }
}
