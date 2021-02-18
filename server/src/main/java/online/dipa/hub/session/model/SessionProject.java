package online.dipa.hub.session.model;

import java.util.HashMap;
import java.util.Map;

import online.dipa.hub.api.model.*;

public class SessionProject {

    private Project project;
    private Map<Long, ProjectTask> projectTasks;


    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Map<Long, ProjectTask> getProjectTasks() {
        if (projectTasks == null) {
            setProjectTasks(new HashMap<>());
        }
        return projectTasks;
    }

    public void setProjectTasks(Map<Long, ProjectTask> projectTasks) {
        this.projectTasks = projectTasks;
    }

    public ProjectTask findProjectTask(Long projectTaskId) {
        return getProjectTasks().computeIfAbsent(projectTaskId, t -> new ProjectTask());
    }

}
