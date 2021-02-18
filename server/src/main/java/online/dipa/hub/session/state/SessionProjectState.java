package online.dipa.hub.session.state;

import java.util.*;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

import online.dipa.hub.session.model.SessionProject;

@Component
@SessionScope
public class SessionProjectState {

    private Map<Long, SessionProject> sessionProjects;

    public Map<Long, SessionProject> getSessionProjects() {
        if (this.sessionProjects == null) {
            this.sessionProjects = new HashMap<>();
        }
        
        return sessionProjects;
    }

    public void setSessionProjects(Map<Long, SessionProject> sessionProjects) {
        this.sessionProjects = sessionProjects;
    }

    public SessionProject findProjectState(final Long projectId) {
        return getSessionProjects().computeIfAbsent(projectId, t -> new SessionProject());
    }

}