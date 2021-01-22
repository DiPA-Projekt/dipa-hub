import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplatesViewControlsService {

  // not used yet
  private templatesList = new BehaviorSubject<any>(null);

  private isFullscreen = new BehaviorSubject<boolean>(false);
  isFullscreen$ = this.isFullscreen.asObservable();

  private periodStartDate = new BehaviorSubject<Date>(new Date(2020, 0, 1));
  private periodEndDate = new BehaviorSubject<Date>(new Date(2020, 11, 31));

  private viewType = new BehaviorSubject<string>(null);

  constructor() { }

  setIsFullscreen(isFullscreen: boolean): void {
    this.isFullscreen.next(isFullscreen);
  }

  getViewType(): Observable<string> {
    return this.viewType;
  }

  setViewType(viewType: string): void {
    this.viewType.next(viewType);
  }

  getTemplatesList(): Observable<any> {
    return this.templatesList;
  }

  setTemplatesList(templatesList: any): void {
    this.templatesList.next(templatesList);
  }

}
