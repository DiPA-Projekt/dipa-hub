import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemplatesViewControlsService {
  // not used yet
  private templatesList = new BehaviorSubject<any>(null);

  private isFullscreen = new BehaviorSubject<boolean>(false);

  private viewType = new BehaviorSubject<string>(null);

  constructor() {}

  setIsFullscreen(isFullscreen: boolean): void {
    this.isFullscreen.next(isFullscreen);
  }

  getIsFullscreen(): Observable<any> {
    return this.isFullscreen;
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
