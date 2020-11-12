package online.dipa.hub.server.rest;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import org.springframework.http.ResponseEntity;

import online.dipa.hub.api.model.Timeline;
import online.dipa.hub.api.model.Task;
import online.dipa.hub.api.model.Milestone;

import online.dipa.hub.api.rest.TimelinesApi;

@RestApiController
public class TimelineController implements TimelinesApi {

	@Override
	public ResponseEntity<List<Timeline>> getTimelines() {
		return ResponseEntity.ok(List.of(
			new Timeline()
				.id(1L)
				.name("Serveraustausch")
				.defaultTimeline(false),
			new Timeline()
				.id(2L)
				.name("Softwareneuentwicklung")
				.defaultTimeline(true)
			)
		);
	};

    @Override
	public ResponseEntity<List<Milestone>> getMilestonesForTimeline(Integer timelineId) {
		switch (timelineId) {
			case 1:
				return ResponseEntity.ok(List.of(
					new Milestone()
						.id(1L)
						.name("Projektstart")
						.date(LocalDate.parse("2020-02-01")),
					new Milestone()
						.id(2L)
						.name("Kick Off")
						.date(LocalDate.parse("2020-03-01")),
					new Milestone()
						.id(3L)
						.name("Zuschlagserteilung")
						.date(LocalDate.parse("2020-09-01")),
					new Milestone()
						.id(4L)
						.name("Rolloutdrehbuch")
						.date(LocalDate.parse("2020-12-01")),
					new Milestone()
						.id(5L)
						.name("Beginn Rollout Phase 1")
						.date(LocalDate.parse("2021-02-01")),
					new Milestone()
						.id(6L)
						.name("Beginn Rollout Phase 2")
						.date(LocalDate.parse("2021-05-01")),
					new Milestone()
						.id(7L)
						.name("Ende Phase 1")
						.date(LocalDate.parse("2021-06-01")),
					new Milestone()
						.id(8L)
						.name("Beginn Rollout Phase 3")
						.date(LocalDate.parse("2021-07-01")),
					new Milestone()
						.id(9L)
						.name("Ende Phase 2")
						.date(LocalDate.parse("2021-09-01")),
					new Milestone()
						.id(10L)
						.name("Ende Phase 3")
						.date(LocalDate.parse("2021-12-01")),
					new Milestone()
						.id(11L)
						.name("Projektabschlussbericht")
						.date(LocalDate.parse("2022-03-01")),
					new Milestone()
						.id(12L)
						.name("Projektende")
						.date(LocalDate.parse("2022-06-01"))
					)
				);
			case 2:
				return ResponseEntity.ok(List.of(
					new Milestone()
						.id(21L)
						.name("Projekteinrichtung")
						.date(LocalDate.parse("2020-05-01")),
					new Milestone()
						.id(22L)
						.name("Entwicklung Pre-Alpha")
						.date(LocalDate.parse("2020-07-01")),
					new Milestone()
						.id(23L)
						.name("Entwicklung Alpha")
						.date(LocalDate.parse("2020-11-01")),
					new Milestone()
						.id(24L)
						.name("Entwicklung Beta")
						.date(LocalDate.parse("2021-02-01")),
					new Milestone()
						.id(25L)
						.name("Entwicklung Release Candidate")
						.date(LocalDate.parse("2021-05-01")),
					new Milestone()
						.id(26L)
						.name("Entwicklung Release 1.0")
						.date(LocalDate.parse("2021-08-01")),
					new Milestone()
						.id(27L)
						.name("Projektabschluss")
						.date(LocalDate.parse("2021-11-01")),
					new Milestone()
						.id(28L)
						.name("Release 1.0")
						.date(LocalDate.parse("2022-02-01"))
					)
				);
			default:
				return ResponseEntity.ok(List.of(
					new Milestone()
						.id(31L)
						.name("Test")
						.date(LocalDate.parse("2020-01-01"))
				));
		}
	}

	@Override
	public ResponseEntity<List<Task>> getTasksForTimeline(Integer timelineId) {
		switch (timelineId) {
			case 1:
				return ResponseEntity.ok(List.of(
					new Task()
						.id(1L)
						.name("Task 1")
						.start(LocalDate.parse("2020-01-01"))
						.end(LocalDate.parse("2020-04-04")),
					new Task()
						.id(2L)
						.name("Task 2")
						.start(LocalDate.parse("2020-05-01"))
						.end(LocalDate.parse("2020-05-30")),
					new Task()
						.id(3L)
						.name("Task 3")
						.start(LocalDate.parse("2020-06-08"))
						.end(LocalDate.parse("2020-10-15"))
					));

			case 2:
				return ResponseEntity.ok(Collections.emptyList());
			default:
				return ResponseEntity.ok(List.of(
						new Task()
								.id(6L)
								.name("Test")
								.start(LocalDate.parse("2020-01-01"))
								.end(LocalDate.parse("2020-12-31"))
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