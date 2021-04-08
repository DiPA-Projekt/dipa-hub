package online.dipa.hub.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.*;
import online.dipa.hub.api.model.*;
import online.dipa.hub.persistence.entities.*;

import online.dipa.hub.persistence.repositories.*;

@Mapper(componentModel = "spring")
public interface ProjectTaskProjectTaskEntityMapper 
        extends FormFieldMapper {

    void updateProjectTaskEntity(ProjectTask projectTask, @MappingTarget ProjectTaskEntity projectTaskEntity,
    @Context ResultRepository resultRepository, @Context FormFieldRepository formFieldRepository);

    @AfterMapping
	default void setResults(ProjectTask projectTask, @MappingTarget ProjectTaskEntity projectTaskEntity, @Context ResultRepository resultRepository,
    @Context FormFieldRepository formFieldRepository){

        List<FormFieldEntity> oldEntriesList = new ArrayList<>(projectTaskEntity.getEntries());
        List<FormField> newList = projectTask.getEntries().stream().map(FormField.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldEntriesList.size() - 1) {

                FormFieldEntity entity = toFormFieldEntity(newList.get(i));
                entity.setId(formFieldRepository.count() + 1);
                entity.setProjectTask(projectTaskEntity);

                formFieldRepository.save(entity);
            }
            else {
                updateFormField(newList.get(i), oldEntriesList.get(i));
            }
        }
        updateResults(projectTaskEntity, projectTask, resultRepository, formFieldRepository);
    }

    default void updateResults(ProjectTaskEntity projectTaskEntity, ProjectTask projectTask,
    ResultRepository resultRepository, FormFieldRepository formFieldRepository) {

        List<ResultEntity> oldList = new ArrayList<>(projectTaskEntity.getResults());
        List<Result> newList = projectTask.getResults().stream().map(Result.class::cast).collect(Collectors.toList());

        for (int i = 0; i < newList.size(); i++) {

            if (i > oldList.size() - 1) {

                ResultEntity entity = new ResultEntity();
                entity.setId(resultRepository.count() + 1);
                // entity.setResultType(entity.getResultType()); // "TYPE_ELBE_SC"
                entity.setProjectTask(projectTaskEntity);
                resultRepository.save(entity);

                List<FormField> newListEntries = newList.get(i).getFormFields();

                for (FormField newListEntry : newListEntries) {
                    FormFieldEntity formField = toFormFieldEntity(newListEntry);

                    formField.setId(formFieldRepository.count() + 1);
                    formField.setResultEntity(entity);

                    formFieldRepository.save(formField);
                }
            } else {
                List<FormFieldEntity> oldEntriesList = new ArrayList<>(oldList.get(i).getFormFields());
                List<FormField> newListEntries = newList.get(i).getFormFields();

                for (int j = 0; j < newListEntries.size(); j++) {
                    updateFormField(newListEntries.get(j), oldEntriesList.get(j));
                }
            }

        }
    }

}

