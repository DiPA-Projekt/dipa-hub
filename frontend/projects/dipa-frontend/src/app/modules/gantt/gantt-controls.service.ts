import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GanttControlsService {

  // not used yet
  private isFullscreen = new BehaviorSubject<boolean>(false);
  isFullscreen$ = this.isFullscreen.asObservable();

  constructor() { }

  setIsFullscreen(isFullscreen: boolean): void {
    this.isFullscreen.next(isFullscreen);
  }

}
