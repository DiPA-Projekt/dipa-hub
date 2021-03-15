import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Project, ProjectService } from 'dipa-api-client';
import { ProjectChecklistComponent } from '../project-checklist/project-checklist.component';

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
export class ProjectDataComponent implements OnInit, OnDestroy {
  @ViewChild(ProjectChecklistComponent) private projectChecklistComponent: ProjectChecklistComponent;

  public selectedTimelineId: number;

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
      projectOwner: '',
    });
  }

  public ngOnInit(): void {
    this.projectDataSubscription = this.activatedRoute.parent.params
      .pipe(
        switchMap(
          (params: Params): Observable<Project> => {
            this.selectedTimelineId = parseInt(params.id, 10);
            return this.projectService.getProjectData(this.selectedTimelineId);
          }
        )
      )
      .subscribe((data: Project) => {
        this.setReactiveForm(data);
      });
  }

  public ngOnDestroy(): void {
    this.projectDataSubscription?.unsubscribe();
  }

  public displayProjectSize(size: string): string {
    return this.sizes.find((x: ProjectSize) => x.value === size)?.display;
  }

  public onSubmit(form: FormGroup): void {
    this.projectService.updateProjectData(this.selectedTimelineId, form.value).subscribe(() => {
      form.reset(form.value);
      this.projectChecklistComponent.ngOnInit();
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
      projectOwner: [data?.projectOwner],
    });
  }
}
