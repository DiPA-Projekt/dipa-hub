import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {GanttControlsService} from './gantt-controls.service';
import {ChartComponent} from './chart/chart.component';
import {TimelineService} from './services/timeline.service';
import {forkJoin, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss']
})
export class GanttComponent implements OnInit {

  @Output() dateChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('ganttChart', { static: true }) chart: ChartComponent;

  periodStartDate = new Date(2020, 0, 1);
  periodEndDate = new Date(2020, 11, 31);

  vm$: Observable<any>;

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

    this.vm$ = forkJoin([this.timelineService.getTaskData(), this.timelineService.getMilestoneTaskData()])
      .pipe(
        map(([taskData, milestoneData]) => {
          const milestoneDates = milestoneData.map(x => x.start);
          const taskStartDates = taskData.map(x => x.start);
          const taskEndDates = taskData.map(x => x.end);

          const datesArray: Date[] = [...milestoneDates, ...taskStartDates, ...taskEndDates];

          const periodStartDate = GanttComponent.getMinimumDate(datesArray);
          const periodEndDate = GanttComponent.getMaximumDate(datesArray);

          return {
            milestoneData,
            taskData,
            periodStartDate,
            periodEndDate
          };
        }),
        tap( data => {
          this.periodEndDate = data.periodEndDate;
          this.periodStartDate = data.periodStartDate;
        })
      );
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
