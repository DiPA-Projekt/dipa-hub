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
				.defaultTimeline(false),
			new Timeline()
				.id(3L)
				.name("Beschaffung")
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
			case 3:
				return ResponseEntity.ok(List.of(
					new Milestone()
						.id(41L)
						.name("Bedarf ermittelt")
						.date(LocalDate.parse("2020-01-01")),
					new Milestone()
						.id(42L)
						.name("Bedarf strukturiert")
						.date(LocalDate.parse("2020-04-01")),
					new Milestone()
						.id(43L)
						.name("Haushaltsmittel geklärt")
						.date(LocalDate.parse("2020-07-01")),
					new Milestone()
						.id(44L)
						.name("Alternative Beschaffungsvarianten geprüft")
						.date(LocalDate.parse("2020-10-01")),
					new Milestone()
						.id(45L)
						.name("Beschaffung konzipiert")
						.date(LocalDate.parse("2021-01-01")),
					new Milestone()
						.id(46L)
						.name("Lose gebildet")
						.date(LocalDate.parse("2021-04-01")),
					new Milestone()
						.id(47L)
						.name("Verfahrensart festgelegt")
						.date(LocalDate.parse("2021-07-01")),
					new Milestone()
						.id(48L)
						.name("Methoden und Instrumente festgelegt")
						.date(LocalDate.parse("2021-10-01")),
					new Milestone()
						.id(49L)
						.name("Vergabeunterlagen erstellt")
						.date(LocalDate.parse("2022-01-01")),
					new Milestone()
						.id(50L)
						.name("Durchführung entschieden")
						.date(LocalDate.parse("2022-04-01")),
					new Milestone()
						.id(51L)
						.name("Vergabeunterlagen veröffentlicht / Ausgewählte Bieter zur Angebotsabgabe aufgefordert")
						.date(LocalDate.parse("2022-07-01")),
					new Milestone()
						.id(52L)
						.name("Teilnahmeanträge geöffnet")
						.date(LocalDate.parse("2022-10-01")),
					new Milestone()
						.id(53L)
						.name("Bewerber ausgewählt")
						.date(LocalDate.parse("2023-01-01")),
					new Milestone()
						.id(54L)
						.name("Angebote geöffnet")
						.date(LocalDate.parse("2023-04-01")),
					new Milestone()
						.id(55L)
						.name("Angebote / Verhandlungen bewertet")
						.date(LocalDate.parse("2023-07-01")),
					new Milestone()
						.id(56L)
						.name("Vertrag geschlossen (oder Verfahren aufgehoben)")
						.date(LocalDate.parse("2023-10-01"))
					)
				);
			default:
				return ResponseEntity.ok(List.of(
					new Milestone()
						.id(31L)
						.name("Test")
						.date(LocalDate.parse("2020-01-01"))
					)
				);
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
					)
				);
			case 2:
			case 3:
				return ResponseEntity.ok(Collections.emptyList());
			default:
				return ResponseEntity.ok(List.of(
					new Task()
						.id(6L)
						.name("Test")
						.start(LocalDate.parse("2020-01-01"))
						.end(LocalDate.parse("2020-12-31"))
					)
				);
		}
	}
}
