package online.dipa.hub.session.model;

import online.dipa.hub.api.model.Increment;
import online.dipa.hub.api.model.Milestone;
import online.dipa.hub.api.model.Task;
import online.dipa.hub.api.model.Timeline;

import java.util.List;

public class SessionTimeline {

    private Timeline timeline;

    private List<Milestone> milestones;

    private List<Milestone> tempIncrementMilestones;

    private List<Task> tasks;

    private List<Increment> increments;

    private boolean iterative;

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

    public List<Milestone> getTempIncrementMilestones() {
        return tempIncrementMilestones;
    }

    public void setTempIncrementMilestones(List<Milestone> tempIncrementMilestones) {
        this.tempIncrementMilestones = tempIncrementMilestones;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
    
    public List<Increment> getIncrements() {
        return increments;
    }

    public void setIncrements(List<Increment> increments) {
        this.increments = increments;
    }

    public boolean getIterative() {
        return iterative;
    }

    public void setIterative(boolean iterative) {
        this.iterative = iterative;
    }
}
