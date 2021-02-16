package online.dipa.hub;

import java.util.List;

import online.dipa.hub.api.model.*;

public class ProjectState {

    private Project project;
    List<ProjectTask> projectTasks;

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

}
