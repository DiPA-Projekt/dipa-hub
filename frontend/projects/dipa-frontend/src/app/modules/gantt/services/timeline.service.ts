import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  milestoneData = [
    {
      id: 1,
      name: 'Projektstart',
      group: 'Projekt B',
      start: new Date(2020, 1, 1),
      parentId: -1,
      type: 'MILESTONE',
      complete: false
    },
    {
      id: 2,
      name: 'Kick Off',
      group: 'Projekt B',
      start: new Date(2020, 2, 1),
      parentId: -1,
      type: 'MILESTONE',
      complete: false
    },
    {
      id: 3,
      name: 'Zuschlagserteilung',
      group: 'Projekt B',
      start: new Date(2020, 8, 1),
      parentId: -1,
      type: 'MILESTONE',
      complete: false
    },
    {
      id: 4,
      name: 'Rolloutdrehbuch',
      group: 'Projekt B',
      start: new Date(2020, 11, 1),
      parentId: -1,
      type: 'MILESTONE',
      complete: false
    },
    {
      id: 5,
      name: 'Beginn Rollout Phase 1',
      group: 'Projekt B',
      start: new Date(2021, 1, 1),
      parentId: -1,
      type: 'MILESTONE',
      complete: false
    },
    {
      id: 6,
      name: 'Beginn Rollout Phase 2',
      group: 'Projekt B',
      start: new Date(2021, 4, 1),
      parentId: -1,
      type: 'MILESTONE',
      complete: false
    },
    {
      id: 7,
      name: 'Ende Phase 1',
      group: 'Projekt B',
      start: new Date(2021, 5, 1),
      parentId: -1,
      type: 'MILESTONE',
      complete: false
    },
    {
      id: 8,
      name: 'Beginn Rollout Phase 3',
      group: 'Projekt B',
      start: new Date(2021, 6, 1),
      parentId: -1,
      type: 'MILESTONE',
      complete: false
    },
    {
      id: 9,
      name: 'Ende Phase 2',
      group: 'Projekt B',
      start: new Date(2021, 8, 1),
      parentId: -1,
      type: 'MILESTONE',
      complete: false
    },
    {
      id: 10,
      name: 'Ende Phase 3',
      group: 'Projekt B',
      start: new Date(2021, 11, 1),
      parentId: -1,
      type: 'MILESTONE',
      complete: false
    },
    {
      id: 11,
      name: 'Projektabschlussbericht',
      group: 'Projekt B',
      start: new Date(2022, 2, 1),
      parentId: -1,
      type: 'MILESTONE',
      complete: false
    },
    {
      id: 12,
      name: 'Projektende',
      group: 'Projekt B',
      start: new Date(2022, 5, 1),
      parentId: -1,
      type: 'MILESTONE',
      complete: false
    }
  ];

  taskData = [
    {
      id: 1,
      name: 'Task 1',
      group: 'Projekt A',
      start: new Date(2020, 1, 1),
      end: new Date(2020, 4, 4),
      parentId: -1,
      type: 'TASK',
      progress: 5
    },
    {
      id: 2,
      name: 'Task 2',
      group: 'Projekt A',
      start: new Date(2020, 5, 1),
      end: new Date(2020, 5, 30),
      parentId: -1,
      type: 'TASK',
      progress: 20
    },
    {
      id: 3,
      name: 'Task 3',
      group: 'Projekt B',
      start: new Date(2020, 6, 8),
      end: new Date(2020, 10, 15),
      parentId: -1,
      type: 'TASK',
      progress: 100
    },
    {
      id: 4,
      name: 'Task 4',
      group: 'Projekt B',
      start: new Date(2020, 9, 15),
      end: new Date(2020, 11, 23),
      parentId: -1,
      type: 'TASK',
      progress: 50
    },
    {
      id: 5,
      name: 'Task 5',
      group: 'Projekt C',
      start: new Date(2020, 10, 23),
      end: new Date(2020, 11, 31),
      parentId: -1,
      type: 'TASK',
      progress: 80
    }
  ];

  constructor() { }

  getMilestoneTaskData(): Observable<any> {
    return of(this.milestoneData);
  }

  getTaskData(): Observable<any> {
    return of(this.taskData);
  }

}
