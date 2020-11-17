import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GanttControlsService {

  // not used yet
  private isFullscreen = new BehaviorSubject<boolean>(false);
  isFullscreen$ = this.isFullscreen.asObservable();

  private periodStartDate = new BehaviorSubject<Date>(new Date(2020, 0, 1));
  private periodEndDate = new BehaviorSubject<Date>(new Date(2020, 11, 31));

  private viewType = new BehaviorSubject<String>(new String);

  constructor() { }

  setIsFullscreen(isFullscreen: boolean): void {
    this.isFullscreen.next(isFullscreen);
  }


  getPeriodStartDate(): Observable<Date> {
    return this.periodStartDate;
  }

  setPeriodStartDate(periodStartDate: Date): void {
    this.periodStartDate.next(periodStartDate);
  }


  getPeriodEndDate(): Observable<Date> {
    return this.periodEndDate;
  }

  setPeriodEndDate(periodEndDate: Date): void {
    this.periodEndDate.next(periodEndDate);
  }

  getViewType(): Observable<String> {
    return this.viewType;
  }

  setViewType(viewType: String): void {
    this.viewType.next(viewType);
  }
}
