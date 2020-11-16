package online.dipa.hub.server.rest;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.api.model.Task;
import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.api.rest.TimelinesApi;
import online.dipa.hub.persistence.entities.ProjectTypeEntity;
import online.dipa.hub.persistence.repositories.ProjectTypeRepository;

@RestApiController
@Transactional(readOnly = true)
public class TimelineController implements TimelinesApi {

    @Autowired
    private ProjectTypeRepository projectTypeRepository;

    @Autowired
    private ConversionService conversionService;

    @Override
    public ResponseEntity<List<Timeline>> getTimelines() {
        final List<Timeline> timelines = projectTypeRepository.findAll()
                                                              .stream()
                                                              .map(p -> conversionService.convert(p, Timeline.class))
                                                              .collect(Collectors.toList());

        return ResponseEntity.ok(timelines);
    }

    @Override
    public ResponseEntity<List<Milestone>> getMilestonesForTimeline(final Long timelineId) {
        final ProjectTypeEntity projectTypeEntity = projectTypeRepository.findById(timelineId)
                                                                         .orElseThrow(() -> new EntityNotFoundException(
                                                                                 String.format(
                                                                                         "Timeline with id: %1$s not found.",
                                                                                         timelineId)));
        final List<Milestone> milestoneList = projectTypeEntity.getMilestones()
                                                               .stream()
                                                               .map(m -> conversionService.convert(m, Milestone.class))
                                                               .sorted(Comparator.comparing(Milestone::getDate))
                                                               .collect(Collectors.toList());

        return ResponseEntity.ok(milestoneList);
    }

    @Override
    public ResponseEntity<List<Task>> getTasksForTimeline(final Long timelineId) {
        return ResponseEntity.ok(Collections.emptyList());
    }
}
