// package online.dipa.hub.convert;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.core.convert.converter.Converter;
// import org.springframework.stereotype.Component;

// import online.dipa.hub.api.model.Timeline;
// import online.dipa.hub.persistence.entities.MilestoneTemplateEntity;
// import online.dipa.hub.persistence.entities.PlanTemplateEntity;
// import online.dipa.hub.persistence.entities.ProjectApproachEntity;
// import online.dipa.hub.persistence.entities.OperationTypeEntity;
// import online.dipa.hub.persistence.repositories.PlanTemplateRepository;

// import java.time.LocalDate;
// import java.util.ArrayList;
// import java.util.Comparator;
// import java.util.List;
// import java.util.stream.Collectors;

// @Component
// public class ProjectApproachToTimelineConverter implements Converter<ProjectApproachEntity, Timeline> {

//     @Autowired
//     private PlanTemplateRepository planTemplateRepository;

//     @Override
//     public Timeline convert(final ProjectApproachEntity projectApproach) {

//         final OperationTypeEntity operationTypeEntity = projectApproach.getOperationType();
        
//         final Long operationTypeId = projectApproach.getOperationType().getId();    

//         final List<PlanTemplateEntity> planTemplateList = planTemplateRepository.findAll().stream()
//                                                         .filter(template -> template.getOperationTypeEntity().stream().map(this::getOperationType).getId().equals(operationTypeId))
//                                                         .collect(Collectors.toList());       
        
//         final List<MilestoneTemplateEntity> maxMilestoneDateList = new ArrayList<>();

//         for (PlanTemplateEntity planTemplate: planTemplateList) {
//             planTemplate.getMilestones().stream()
//                     .max(Comparator.comparing(MilestoneTemplateEntity::getDateOffset)).ifPresent(maxMilestoneDateList::add);
//         }

//         final MilestoneTemplateEntity maxMilestoneDate = maxMilestoneDateList
//                 .stream()
//                 .max(Comparator.comparing(MilestoneTemplateEntity::getDateOffset)).orElse(null);

//         int maxMilestoneDateOffset = 0;
//         if (maxMilestoneDate != null) {
//             maxMilestoneDateOffset = maxMilestoneDate.getDateOffset();
//         }

//         return new Timeline().id(projectApproach.getId())
//                              .operationTypeId(operationTypeId)
//                              .projectApproachId(projectApproach.getId())
//                              .start(LocalDate.now())
//                              .end(LocalDate.now()
//                                      .plusDays(maxMilestoneDateOffset))
//                              .defaultTimeline(operationTypeEntity.isDefaultType());
//     }

    
//     private boolean getProjectApproach(PlanTemplateEntity template, final Long projectApproachId) {
//         Optional<ProjectApproach> projectApproach = template.getProjectApproach().stream()
//             .map(p -> conversionService.convert(p, ProjectApproach.class))
//             .filter(o -> o.getId().equals(projectApproachId)).findFirst();
//         System.out.println(projectApproach);
        
//         if (projectApproach.isPresent()) {
//             return true;
//         }
//         return false;

//     }

// }
