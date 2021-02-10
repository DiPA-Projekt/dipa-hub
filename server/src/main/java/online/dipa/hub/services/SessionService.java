package online.dipa.hub.services;

import online.dipa.hub.TimelineState;
import online.dipa.hub.api.model.*;
import java.util.*;

public class SessionService {

    protected Map<Long, TimelineState> sessionTimelines;
    protected Map<Long, List<TimelineTemplate>> sessionTimelineTemplates = new HashMap<>();

    public Map<Long, List<TimelineTemplate>> getSessionTimelineTemplates() {
        return sessionTimelineTemplates;
    }

    public void setSessionTimelineTemplates(Map<Long, List<TimelineTemplate>> sessionTimelineTemplates) {
        this.sessionTimelineTemplates = sessionTimelineTemplates;
    }

    public Map<Long, TimelineState> getSessionTimelines() {
        return sessionTimelines;
    }

    public void setSessionTimelines(Map<Long, TimelineState> sessionTimelines) {
        this.sessionTimelines = sessionTimelines;
    }


}