import { Component, EventEmitter, Input, OnDestroy, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Project, ProjectService } from 'dipa-api-client';
import { TimelineDataService } from '../../../shared/timelineDataService';

interface ProjectSize {
  value: string;
  display: string;
  description: string;
}

@Component({
  selector: 'app-project-data',
  templateUrl: './project-data.component.html',
  styleUrls: ['./project-data.component.scss'],
})
export class ProjectDataComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public timelineId: number;
  @Output() public projectSizeChanged = new EventEmitter();

  public myForm: FormGroup;

  public sizes: ProjectSize[] = [
    {
      value: 'SMALL',
      display: 'klein',
      description: 'Aufwand < 250 PT',
    },
    {
      value: 'MEDIUM',
      display: 'mittel',
      description: 'Aufwand 250 - 1.500 PT',
    },
    {
      value: 'BIG',
      display: 'groß',
      description: 'Aufwand > 1.500 PT',
    },
  ];

  private projectDataSubscription: Subscription;

  public constructor(
    private projectService: ProjectService,
    private timelineDataService: TimelineDataService,
    public activatedRoute: ActivatedRoute,
    public fb: FormBuilder
  ) {
    this.setReactiveForm({
      id: -1,
      akz: '',
      name: '',
      projectSize: null,
      client: '',
      department: '',
    });
  }

  public ngOnInit(): void {
    this.projectDataSubscription = this.projectService.getProjectData(this.timelineId).subscribe({
      next: (data: Project) => {
        this.setReactiveForm(data);
      },
      error: null,
      complete: () => void 0,
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('timelineId' in changes) {
      this.projectDataSubscription = this.projectService.getProjectData(this.timelineId).subscribe({
        next: (data: Project) => {
          this.setReactiveForm(data);
        },
        error: null,
        complete: () => void 0,
      });
    }
  }

  public ngOnDestroy(): void {
    this.projectDataSubscription?.unsubscribe();
  }

  public displayProjectSize(size: string): string {
    return this.sizes.find((x: ProjectSize) => x.value === size)?.display;
  }

  public onSubmit(form: FormGroup): void {
    this.projectService.updateProjectData(this.timelineId, form.value).subscribe({
      next: () => {
        form.reset(form.value);
        // in the future should be emitted only if projectSize field changes
        this.projectSizeChanged.emit();
        this.timelineDataService.setTimeline();
      },
      error: null,
      complete: () => void 0,
    });
  }

  public onFocus(event: FocusEvent, path: (string | number)[]): void {
    const valueInput = event.target as HTMLInputElement;
    valueInput.setAttribute('data-value', this.myForm.get(path).value || '');
  }

  public onEscape(event: KeyboardEvent, path: (string | number)[]): void {
    const valueInput = event.target as HTMLInputElement;
    valueInput.value = valueInput.getAttribute('data-value');
    this.myForm.get(path).setValue(valueInput.value);
  }

  private setReactiveForm(data: Project): void {
    this.myForm = this.fb.group({
      id: [data?.id],
      akz: [data?.akz],
      name: [data?.name],
      projectSize: [data?.projectSize],
      client: [data?.client],
      department: [data?.department],
    });
  }
}
