import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TimelineTemplate } from 'dipa-api-client';

@Injectable({
  providedIn: 'root',
})
export class TemplatesViewControlsService {
  private templatesList = new BehaviorSubject<any>(null);

  private viewType = new BehaviorSubject<string>(null);

  getViewType(): Observable<string> {
    return this.viewType;
  }

  setViewType(viewType: string): void {
    this.viewType.next(viewType);
  }

  getTemplatesList(): Observable<any> {
    return this.templatesList;
  }

  setTemplatesList(templatesList: TimelineTemplate[]): void {
    this.templatesList.next(templatesList);
  }
}
