import { TestBed } from '@angular/core/testing';

import { GanttControlsService } from './gantt-controls.service';

describe('GanttControlsService', () => {
  let service: GanttControlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GanttControlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
