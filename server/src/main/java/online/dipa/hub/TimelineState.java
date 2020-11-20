package online.dipa.hub;

import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.api.model.Task;

import java.time.LocalDate;
import java.util.List;

public class TimelineState {

    LocalDate start;

    LocalDate end;

    Boolean isDefaultType;

    List<Milestone> milestones;

    List<Task> tasks;


    public LocalDate getStart() {
        return start;
    }

    public void setStart(LocalDate start) {
        this.start = start;
    }

    public LocalDate getEnd() {
        return end;
    }

    public void setEnd(LocalDate end) {
        this.end = end;
    }

    public Boolean getDefaultType() {
        return isDefaultType;
    }

    public void setDefaultType(Boolean defaultType) {
        isDefaultType = defaultType;
    }

    public List<Milestone> getMilestones() {
        return milestones;
    }

    public void setMilestones(List<Milestone> milestones) {
        this.milestones = milestones;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
