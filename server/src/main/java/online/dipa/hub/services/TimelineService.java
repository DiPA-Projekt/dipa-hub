package online.dipa.hub.services;

import online.dipa.hub.TimelineState;
import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.persistence.entities.ProjectTypeEntity;
import online.dipa.hub.persistence.repositories.ProjectTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.annotation.SessionScope;

import javax.persistence.EntityNotFoundException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@SessionScope
@Transactional
public class TimelineService {

    Map<Long, TimelineState> sessionTimelines;

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private ProjectTypeRepository projectTypeRepository;

    public List<Timeline> getTimelines() {

        List<Timeline> timelines = projectTypeRepository.findAll()
                .stream()
                .map(p -> conversionService.convert(p, Timeline.class))
                .collect(Collectors.toList());

        timelines.forEach(t -> {
            TimelineState sessionTimeline = getSessionTimelines().get(t.getId());

            if (sessionTimeline == null) {
                sessionTimeline = new TimelineState();

                sessionTimeline.setId(t.getId());
                sessionTimeline.setName(t.getName());
                sessionTimeline.setStart(t.getStart());
                sessionTimeline.setEnd(t.getEnd());
                sessionTimeline.setDefaultTimeline(t.getDefaultTimeline());

                sessionTimelines.put(t.getId(), sessionTimeline);
            }
        });

        return sessionTimelines.values().stream()
                .map(t -> new Timeline()
                        .id(t.getId())
                        .name(t.getName())
                        .start(t.getStart())
                        .end(t.getEnd())
                        .defaultTimeline(t.getDefaultTimeline()))
                .collect(Collectors.toList());
    }

    public List<Milestone> getMilestonesForTimeline(final Long timelineId) {

        List<Milestone> milestones;

        TimelineState sessionTimeline = getSessionTimelines().get(timelineId);
        if (sessionTimeline != null) {

            milestones = sessionTimeline.getMilestones();
            if (milestones == null) {
                // get milestones from DB
                milestones = getMilestones(timelineId);
                sessionTimeline.setMilestones(milestones);
            }
        } else {
            sessionTimeline = new TimelineState();
            // get milestones from DB
            milestones = getMilestones(timelineId);
            sessionTimeline.setMilestones(milestones);

            sessionTimelines.put(timelineId, sessionTimeline);
        }
        return milestones;
    }

    private List<Milestone> getMilestones(final Long timelineId) {
        final ProjectTypeEntity projectTypeEntity = projectTypeRepository.findById(timelineId)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format(
                                "Timeline with id: %1$s not found.",
                                timelineId)));

        return projectTypeEntity.getMilestones()
                .stream()
                .map(m -> conversionService.convert(m, Milestone.class))
                .sorted(Comparator.comparing(Milestone::getDate))
                .collect(Collectors.toList());
    }

    private Map<Long, TimelineState> getSessionTimelines() {
        if (this.sessionTimelines == null) {
            this.sessionTimelines = new HashMap<>();
        }
        return this.sessionTimelines;
    }

}
