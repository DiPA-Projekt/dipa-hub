package online.dipa.hub;

import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.api.model.Task;

import java.time.LocalDate;
import java.util.List;

public class TimelineState {

    Long id;

    String name;

    LocalDate start;

    LocalDate end;

    Boolean defaultTimeline;

    List<Milestone> milestones;

    List<Task> tasks;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

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

    public Boolean getDefaultTimeline() {
        return defaultTimeline;
    }

    public void setDefaultTimeline(Boolean defaultTimeline) {
        this.defaultTimeline = defaultTimeline;
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
