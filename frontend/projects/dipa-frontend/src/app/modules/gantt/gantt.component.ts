import {AfterContentInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {GanttControlsService} from './gantt-controls.service';
import {ChartComponent} from './chart/chart.component';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss']
})
export class GanttComponent implements OnInit, AfterContentInit {

  @Output() dateChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('ganttChart', { static: true }) chart: ChartComponent;

  chartData = [];

  milestoneData = [];
  taskData = [];

  periodStartDate;
  periodEndDate;

  constructor(public ganttControlsService: GanttControlsService) { }

  ngOnInit(): void {
    this.dateChange.emit();
  }

  initialize(): void {

    this.milestoneData = [
      {
        id: 1,
        name: 'Milestone 1',
        group: 'Projekt B',
        start: new Date(2020, 2, 1),
        parentId: -1,
        type: 'MILESTONE',
        complete: false
      },
      {
        id: 2,
        name: 'Milestone 2',
        group: 'Projekt B',
        start: new Date(2020, 4, 6),
        parentId: -1,
        type: 'MILESTONE',
        complete: false
      },
      {
        id: 3,
        name: 'Milestone 3',
        group: 'Projekt B',
        start: new Date(2020, 6, 8),
        parentId: -1,
        type: 'MILESTONE',
        complete: false
      },
      {
        id: 4,
        name: 'Milestone 4',
        group: 'Projekt B',
        start: new Date(2020, 9, 15),
        parentId: -1,
        type: 'MILESTONE',
        complete: false
      },
      {
        id: 5,
        name: 'Milestone 5',
        group: 'Projekt B',
        start: new Date(2020, 11, 23),
        parentId: -1,
        type: 'MILESTONE',
        complete: false
      }
    ];

    this.taskData = [
      {
        id: 1,
        name: 'Task 12',
        group: 'Projekt A',
        start: new Date(2020, 1, 1),
        end: new Date(2020, 4, 4),
        parentId: -1,
        type: 'MILESTONE',
        progress: 5
      },
      {
        id: 2,
        name: 'Task 2',
        group: 'Projekt A',
        start: new Date(2020, 5, 1),
        end: new Date(2020, 5, 30),
        parentId: -1,
        type: 'MILESTONE',
        progress: 20
      },
      {
        id: 3,
        name: 'Task 3',
        group: 'Projekt B',
        start: new Date(2020, 6, 8),
        end: new Date(2020, 10, 15),
        parentId: -1,
        type: 'MILESTONE',
        progress: 100
      },
      {
        id: 4,
        name: 'Task 4',
        group: 'Projekt B',
        start: new Date(2020, 9, 15),
        end: new Date(2020, 11, 23),
        parentId: -1,
        type: 'MILESTONE',
        progress: 50
      },
      {
        id: 5,
        name: 'Task 5',
        group: 'Projekt C',
        start: new Date(2020, 10, 23),
        end: new Date(2021, 0, 28),
        parentId: -1,
        type: 'MILESTONE',
        progress: 80
      }
    ];

    this.chart.milestoneData = [...this.milestoneData];
    this.chart.taskData = [...this.taskData];

  }

  ngAfterContentInit(): void {
    this.initialize();
  }

  changeStartDate(change: string, $event: any): void {
    if ($event.value) {
      this.periodStartDate = $event.value;
      console.log($event);
      // this.drawChart();
    }
  }

  changeEndDate(change: string, $event: any): void {
    if ($event.value) {
      this.periodEndDate = $event.value;
      console.log($event);
      // this.drawChart();
    }
  }

}
