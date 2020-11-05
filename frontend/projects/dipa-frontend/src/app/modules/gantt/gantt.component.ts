import {AfterContentInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {GanttControlsService} from './gantt-controls.service';
import {ChartComponent} from './chart/chart.component';
import {TimelineService} from './services/timeline.service';
import { forkJoin, pipe } from 'rxjs';
import { switchMap,map } from 'rxjs/operators'; 

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

  periodStartDateArray = [];
  periodEndDateArray = [];
  
  constructor(public ganttControlsService: GanttControlsService,
              private timelineService: TimelineService) {  }


  ngOnInit(): void {
    
    pipe(
      switchMap(() => forkJoin([this.timelineService.getTaskData(),this.timelineService.getMilestoneTaskData()])),
        map(([tasks,milestones]) => {
          this.periodStartDate  = Math.min.apply(null,[getMinimumStartDate(tasks), getMinimumStartDate(milestones)]);
          this.periodEndDate    = Math.max.apply(null,[getMaximumEndDate(tasks), getMaximumEndDate(milestones)]);
        }
      )
    )

    function getMinimumStartDate(data): Date {
      const min = data.reduce((accumulator,currentValue) => {
          return (accumulator < currentValue.start ? accumulator : currentValue.start);
        }
      )
      return min;
    }

    function getMaximumEndDate(data): Date {
      const max = data.reduce((accumulator,currentValue) => {
          if(currentValue.end) {
            return (accumulator > currentValue.end ? accumulator : currentValue.end);
          } else {
            return (accumulator > currentValue.start ? accumulator : currentValue.start);
          }
        }
      )
      return max;
    }


    // var earliest = new Date(Math.min.apply(null,this.periodStartDateArray));
    // var last = new Date(Math.max.apply(null,this.periodEndDateArray));

    // this.periodStartDate = earliest; 
    // this.periodEndDate = last; 

        
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
