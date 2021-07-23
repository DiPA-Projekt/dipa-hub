import { Component, EventEmitter, Input, OnDestroy, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Project, ProjectService } from 'dipa-api-client';
import { TimelineDataService } from '../../../shared/timelineDataService';
import { AuthenticationService } from '../../../authentication.service';

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
  @Input() userHasProjectEditRights: boolean;
  @Output() public projectSizeChanged = new EventEmitter();

  public projectForm: FormGroup;

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
    private authenticationService: AuthenticationService,
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
      archived: false,
    });
  }

  public ngOnInit(): void {
    this.projectDataSubscription = this.timelineDataService.getProjectData().subscribe({
      next: (data: Project) => {
        this.setReactiveForm(data);
      },
      error: null,
      complete: () => void 0,
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('timelineId' in changes) {
      this.timelineDataService.setProjectData(this.timelineId);
      this.projectDataSubscription = this.timelineDataService.getProjectData().subscribe({
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
        this.timelineDataService.setTimelines();
        this.timelineDataService.setProjectData(this.timelineId);
      },
      error: null,
      complete: () => void 0,
    });
  }

  public onFocus(event: FocusEvent, path: (string | number)[]): void {
    const valueInput = event.target as HTMLInputElement;
    valueInput.setAttribute('data-value', this.projectForm.get(path).value || '');
  }

  public onEscape(event: KeyboardEvent, path: (string | number)[]): void {
    const valueInput = event.target as HTMLInputElement;
    valueInput.value = valueInput.getAttribute('data-value');
    this.projectForm.get(path).setValue(valueInput.value);
  }

  private setReactiveForm(project: Project): void {
    this.authenticationService.getProjectRoles().then((roles) => {
      this.userHasProjectEditRights =
        !project?.archived &&
        roles.filter((d) => d.projectId === this.timelineId && (d.abbreviation === 'PL' || d.abbreviation === 'PE'))
          .length > 0;

      this.projectForm = this.fb.group({
        id: new FormControl({ value: project?.id, disabled: !this.userHasProjectEditRights }),
        akz: new FormControl({ value: project?.akz, disabled: !this.userHasProjectEditRights }),
        name: new FormControl({ value: project?.name, disabled: !this.userHasProjectEditRights }),
        projectSize: new FormControl({ value: project?.projectSize, disabled: !this.userHasProjectEditRights }),
        client: new FormControl({ value: project?.client, disabled: !this.userHasProjectEditRights }),
        department: new FormControl({ value: project?.department, disabled: !this.userHasProjectEditRights }),
        archived: [project?.archived],
      });
    });
    this.projectForm = this.fb.group({
      id: new FormControl({ value: project?.id, disabled: true }),
      akz: new FormControl({ value: project?.akz, disabled: true }),
      name: new FormControl({ value: project?.name, disabled: true }),
      projectSize: new FormControl({ value: project?.projectSize }),
      client: new FormControl({ value: project?.client, disabled: true }),
      department: new FormControl({ value: project?.department, disabled: true }),
      archived: [project?.archived],
    });
  }
}
