import {AfterContentInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {GanttControlsService} from './gantt-controls.service';
import {ChartComponent} from './chart/chart.component';
import {TimelineService} from './services/timeline.service';

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

  periodStartDate = new Date(2020, 0, 1);
  periodEndDate = new Date(2020, 11, 31);

  constructor(public ganttControlsService: GanttControlsService,
              private timelineService: TimelineService) {

    this.timelineService.getTaskData()
    .subscribe((data) => {
      this.taskData = data;
    });

    this.timelineService.getMilestoneTaskData()
    .subscribe((data) => {
      this.milestoneData = data;
    });
  }

  ngOnInit(): void {
    this.dateChange.emit();
  }

  initialize(): void {
    this.chart.milestoneData = [...this.milestoneData];
    this.chart.taskData = [...this.taskData];
  }

  ngAfterContentInit(): void {
    this.initialize();
  }

  changeStartDate(change: string, $event: any): void {
    if ($event.value) {
      this.periodStartDate = $event.value;
    }
  }

  changeEndDate(change: string, $event: any): void {
    if ($event.value) {
      this.periodEndDate = $event.value;
    }
  }

}
