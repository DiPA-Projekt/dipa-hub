package online.dipa.hub;

import online.dipa.hub.TimelineState;
import online.dipa.hub.api.model.*;
import java.util.*;

public class SessionState {

    protected static Map<Long, TimelineState> sessionTimelines;
    protected static Map<Long, List<TimelineTemplate>> sessionTimelineTemplates = new HashMap<>();

    public Map<Long, List<TimelineTemplate>> getSessionTimelineTemplates() {
        return sessionTimelineTemplates;
    }

    public void setSessionTimelineTemplates(Map<Long, List<TimelineTemplate>> sessionTimelineTemplates) {
        this.sessionTimelineTemplates = sessionTimelineTemplates;
    }

    public Map<Long, TimelineState> getSessionTimelines() {
        if (sessionTimelines == null) {
            setSessionTimelines(new HashMap<>());
         }
        return sessionTimelines;
    }

    public void setSessionTimelines(Map<Long, TimelineState> sessionTimelines) {
        this.sessionTimelines = sessionTimelines;
    }

    public TimelineState findTimelineState(Long timelineId) {
        return getSessionTimelines().computeIfAbsent(timelineId, t -> new TimelineState());
    }



}