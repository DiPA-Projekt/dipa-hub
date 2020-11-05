import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {GanttControlsService} from './gantt-controls.service';
import {ChartComponent} from './chart/chart.component';
import {TimelineService} from './services/timeline.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss']
})
export class GanttComponent implements OnInit {

  @Output() dateChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('ganttChart', { static: true }) chart: ChartComponent;

  chartData = [];

  milestoneData = [];
  taskData = [];

  periodStartDate = new Date(2020, 0, 1);
  periodEndDate = new Date(2020, 11, 31);

  constructor(public ganttControlsService: GanttControlsService,
              private timelineService: TimelineService) {  }

  static getMinimumDate(data: Date[]): Date {
    return data.reduce((acc, curr) => {
      return acc < curr ? acc : curr;
    });
  }

  static getMaximumDate(data: Date[]): Date {
    return data.reduce((acc, curr) => {
      return acc > curr ? acc : curr;
    });
  }

  ngOnInit(): void {

    forkJoin([this.timelineService.getTaskData(), this.timelineService.getMilestoneTaskData()])
    .subscribe((data) => {

      this.taskData = data[0];
      this.milestoneData = data[1];

      const milestoneDates = this.milestoneData.map(x => x.start);
      const taskStartDates = this.taskData.map(x => x.start);
      const taskEndDates = this.taskData.map(x => x.end);

      const datesArray: Date[] = [...milestoneDates, ...taskStartDates, ...taskEndDates];

      this.periodStartDate = GanttComponent.getMinimumDate(datesArray);
      this.periodEndDate = GanttComponent.getMaximumDate(datesArray);
    });
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
