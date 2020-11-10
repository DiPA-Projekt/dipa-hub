package online.dipa.hub.server.rest;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;

import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.api.model.Task;
import online.dipa.hub.api.model.Milestone;

import online.dipa.hub.api.rest.TimelinesApi;

@RestApiController
public class TimelineController implements TimelinesApi {


    // @Api(value = "timelines", description = "the timelines API")

    // LocalDate.parse("2020-01-08")
    
    // LocalDate.of(2020, 1, 8)

	@Override
	public ResponseEntity<List<Timeline>> getTimelines() {
		return ResponseEntity.ok(List.of(
			new Timeline()
				.id(1L)
				.name("epic_1")
				.defaultTimeline(true),
			new Timeline()
				.id(2L)
				.name("epic_2")
				.defaultTimeline(false)
			)
		);
	};


    @Override
	public ResponseEntity<List<Milestone>> getMilestonesForTimeline(Integer timelineId) {
		if (timelineId <= 1) {
		return ResponseEntity.ok(List.of(
			new Milestone()
				.id(1L)
				.name("Projektstart")
				.date(LocalDate.parse("2020-01-01"))
				.timelineId(1L),
			new Milestone()
				.id(2L)
				.name("Kick Off")
				.date(LocalDate.parse("2020-02-01"))
				.timelineId(1L),
			new Milestone()
				.id(3L)
				.name("Zuschlagserteilung")
				.date(LocalDate.parse("2020-08-01"))
				.timelineId(1L),
			new Milestone()
				.id(4L)
				.name("Rolloutdrehbuch")
				.date(LocalDate.parse("2020-11-01"))
				.timelineId(1L),
			new Milestone()
				.id(5L)
				.name("Beginn Rollout Phase 1")
				.date(LocalDate.parse("2021-11-01"))
				.timelineId(1L),
			new Milestone()
				.id(6L)
				.name("Beginn Rollout Phase 2")
				.date(LocalDate.parse("2021-04-01"))
				.timelineId(1L)
			));
		}
		else {
		return ResponseEntity.ok(List.of(
			new Milestone()
				.id(7L)
				.name("Ende Phase 1")
				.date(LocalDate.parse("2021-05-01"))
				.timelineId(2L),
			new Milestone()
				.id(8L)
				.name("Beginn Rollout Phase 3")
				.date(LocalDate.parse("2020-06-01"))
				.timelineId(2L),
			new Milestone()
				.id(9L)
				.name("Ende Phase 2")
				.date(LocalDate.parse("2020-08-01"))
				.timelineId(2L),
			new Milestone()
				.id(10L)
				.name("Ende Phase 3")
				.date(LocalDate.parse("2020-11-01"))
				.timelineId(2L),
			new Milestone()
				.id(11L)
				.name("Projektabschlussbericht")
				.date(LocalDate.parse("2022-02-01"))
				.timelineId(2L),
			new Milestone()
				.id(12L)
				.name("Projektende")
				.date(LocalDate.parse("2022-05-01"))
				.timelineId(2L)
			));
		}
	};


	@Override
	public ResponseEntity<List<Task>> getTasksForTimeline(Integer timelineId) {
		if (timelineId <= 1) {
		return ResponseEntity.ok(List.of(
			new Task()
				.id(1L)
				.name("Task 1")
				.start(LocalDate.parse("2020-01-01"))
				.end(LocalDate.parse("2020-04-04"))
				.timelineId(1L),
			new Task()
				.id(2L)
				.name("Task 2")
				.start(LocalDate.parse("2020-05-01"))
                .end(LocalDate.parse("2020-05-30"))
				.timelineId(1L),
			new Task()
				.id(3L)
				.name("Task 3")
				.start(LocalDate.parse("2020-06-08"))
				.end(LocalDate.parse("2020-10-15"))
				.timelineId(1L)
			));
		}
		else {
		return ResponseEntity.ok(List.of(
			new Task()
				.id(4L)
				.name("Task 4")
				.start(LocalDate.parse("2020-09-15"))
				.end(LocalDate.parse("2020-11-23"))
				.timelineId(2L),
			new Task()
				.id(5L)
				.name("Task 5")
				.start(LocalDate.parse("2020-10-23"))
				.end(LocalDate.parse("2020-11-30"))
				.timelineId(2L)
			));
		}
	}





}


// milestoneData = [
//     {
//       id: 1,
//       name: 'Projektstart',
//       group: 'Projekt B',
//       start: new Date(2020, 1, 1),
//       parentId: -1,
//       type: 'MILESTONE',
//       complete: false
//     },
//     {
//       id: 2,
//       name: 'Kick Off',
//       group: 'Projekt B',
//       start: new Date(2020, 2, 1),
//       parentId: -1,
//       type: 'MILESTONE',
//       complete: false
//     },
//     {
//       id: 3,
//       name: 'Zuschlagserteilung',
//       group: 'Projekt B',
//       start: new Date(2020, 8, 1),
//       parentId: -1,
//       type: 'MILESTONE',
//       complete: false
//     },
//     {
//       id: 4,
//       name: 'Rolloutdrehbuch',
//       group: 'Projekt B',
//       start: new Date(2020, 11, 1),
//       parentId: -1,
//       type: 'MILESTONE',
//       complete: false
//     },
//     {
//       id: 5,
//       name: 'Beginn Rollout Phase 1',
//       group: 'Projekt B',
//       start: new Date(2021, 1, 1),
//       parentId: -1,
//       type: 'MILESTONE',
//       complete: false
//     },
//     {
//       id: 6,
//       name: 'Beginn Rollout Phase 2',
//       group: 'Projekt B',
//       start: new Date(2021, 4, 1),
//       parentId: -1,
//       type: 'MILESTONE',
//       complete: false
//     },
//     {
//       id: 7,
//       name: 'Ende Phase 1',
//       group: 'Projekt B',
//       start: new Date(2021, 5, 1),
//       parentId: -1,
//       type: 'MILESTONE',
//       complete: false
//     },
//     {
//       id: 8,
//       name: 'Beginn Rollout Phase 3',
//       group: 'Projekt B',
//       start: new Date(2021, 6, 1),
//       parentId: -1,
//       type: 'MILESTONE',
//       complete: false
//     },
//     {
//       id: 9,
//       name: 'Ende Phase 2',
//       group: 'Projekt B',
//       start: new Date(2021, 8, 1),
//       parentId: -1,
//       type: 'MILESTONE',
//       complete: false
//     },
//     {
//       id: 10,
//       name: 'Ende Phase 3',
//       group: 'Projekt B',
//       start: new Date(2021, 11, 1),
//       parentId: -1,
//       type: 'MILESTONE',
//       complete: false
//     },
//     {
//       id: 11,
//       name: 'Projektabschlussbericht',
//       group: 'Projekt B',
//       start: new Date(2022, 2, 1),
//       parentId: -1,
//       type: 'MILESTONE',
//       complete: false
//     },
//     {
//       id: 12,
//       name: 'Projektende',
//       group: 'Projekt B',
//       start: new Date(2022, 5, 1),
//       parentId: -1,
//       type: 'MILESTONE',
//       complete: false
//     }
//   ];

//   taskData = [
//     {
//       id: 1,
//       name: 'Task 1',
//       group: 'Projekt A',
//       start: new Date(2020, 1, 1),
//       end: new Date(2020, 4, 4),
//       parentId: -1,
//       type: 'TASK',
//       progress: 5
//     },
//     {
//       id: 2,
//       name: 'Task 2',
//       group: 'Projekt A',
//       start: new Date(2020, 5, 1),
//       end: new Date(2020, 5, 30),
//       parentId: -1,
//       type: 'TASK',
//       progress: 20
//     },
//     {
//       id: 3,
//       name: 'Task 3',
//       group: 'Projekt B',
//       start: new Date(2020, 6, 8),
//       end: new Date(2020, 10, 15),
//       parentId: -1,
//       type: 'TASK',
//       progress: 100
//     },
//     {
//       id: 4,
//       name: 'Task 4',
//       group: 'Projekt B',
//       start: new Date(2020, 9, 15),
//       end: new Date(2020, 11, 23),
//       parentId: -1,
//       type: 'TASK',
//       progress: 50
//     },
//     {
//       id: 5,
//       name: 'Task 5',
//       group: 'Projekt C',
//       start: new Date(2020, 10, 23),
//       end: new Date(2020, 11, 30),
//       parentId: -1,
//       type: 'TASK',
//       progress: 80
//     }
//   ];