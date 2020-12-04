package online.dipa.hub;

import online.dipa.hub.api.model.Increment;
import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.api.model.Task;
import online.dipa.hub.api.model.Timeline;

import java.util.List;

public class TimelineState {

    private Timeline timeline;

    private List<Milestone> milestones;

    private List<Task> tasks;

    private List<Increment> increments;

    private Long incrementCount;

    public Timeline getTimeline() {
        return timeline;
    }

    public void setTimeline(Timeline timeline) {
        this.timeline = timeline;
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

    public Long getIncrementCount() {
        return incrementCount;
    }

    public void setIncrementCount(Long incrementCount) {
        this.incrementCount = incrementCount;
    }

    public List<Increment> getIncrements() {
        return increments;
    }

    public void setIncrements(List<Increment> increments) {
        this.increments = increments;
    }
}
