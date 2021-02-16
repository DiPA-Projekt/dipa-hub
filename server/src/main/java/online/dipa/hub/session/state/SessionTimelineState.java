package online.dipa.hub.session.state;

import online.dipa.hub.api.model.*;
import online.dipa.hub.session.model.SessionTimeline;

import java.util.*;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

@Component
@SessionScope
public class SessionTimelineState {

    private Map<Long, SessionTimeline> sessionTimelines;
    private Map<Long, List<TimelineTemplate>> sessionTimelineTemplates = new HashMap<>();

    public Map<Long, List<TimelineTemplate>> getSessionTimelineTemplates() {
        return sessionTimelineTemplates;
    }

    public void setSessionTimelineTemplates(Map<Long, List<TimelineTemplate>> sessionTimelineTemplates) {
        this.sessionTimelineTemplates = sessionTimelineTemplates;
    }

    public Map<Long, SessionTimeline> getSessionTimelines() {
        if (sessionTimelines == null) {
            setSessionTimelines(new HashMap<>());
        }
        return sessionTimelines;
    }

    public void setSessionTimelines(Map<Long, SessionTimeline> sessionTimelines) {
        this.sessionTimelines = sessionTimelines;
    }

    public SessionTimeline findTimelineState(Long timelineId) {
        return getSessionTimelines().computeIfAbsent(timelineId, t -> new SessionTimeline());
    }


}