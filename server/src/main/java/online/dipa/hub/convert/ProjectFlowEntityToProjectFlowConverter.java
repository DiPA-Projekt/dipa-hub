package online.dipa.hub.convert;

import online.dipa.hub.api.model.ExternalLink;
import online.dipa.hub.api.model.ProjectFlowStep;
import online.dipa.hub.api.model.StepAction;
import online.dipa.hub.persistence.entities.ProjectFlowStepActionEntity;
import online.dipa.hub.persistence.entities.ProjectFlowStepEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ProjectFlowEntityToProjectFlowConverter implements Converter<ProjectFlowStepEntity, ProjectFlowStep> {

    @Autowired
    protected ExternalLinkEntityToExternalLinkConverter externalLinkEntityToExternalLinkConverter;

    @Override
    public ProjectFlowStep convert(final ProjectFlowStepEntity entity) {

        final Set<ProjectFlowStepActionEntity> projectFlowStepAction = entity.getProjectFlowStepActions();

        List<StepAction> stepActions = projectFlowStepAction.stream().map(this::getStepAction).collect(Collectors.toList());

        return new ProjectFlowStep().id(entity.getId())
                .name(entity.getName())
                .sortOrder(entity.getSortOrder())
                .actions(stepActions);
    }

    private StepAction getStepAction(ProjectFlowStepActionEntity action) {
        List<ExternalLink> externalLinks = action.getExternalLinks()
            .stream()
            .map(p -> externalLinkEntityToExternalLinkConverter.convert(p))
            .collect(Collectors.toList());

        return new StepAction()
                .explanation(action.getExplanation())
                .links(externalLinks);
    }
}
