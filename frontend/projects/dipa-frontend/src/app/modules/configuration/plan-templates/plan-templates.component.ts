import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  OperationType,
  OperationTypesService,
  PlanTemplate,
  ProjectApproach,
  ProjectApproachesService,
  ConfigurationService,
} from 'dipa-api-client';
import { forkJoin, Subscription } from 'rxjs';
import { ConfigurationDataService } from '../../../shared/configurationDataService';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PlanTemplateDialogComponent } from '../plan-template-dialog/plan-template-dialog.component';

@Component({
  selector: 'app-plan-templates',
  templateUrl: './plan-templates.component.html',
  styleUrls: ['./plan-templates.component.scss'],
})
export class PlanTemplatesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) public paginator: MatPaginator;

  public displayedColumns = ['index', 'name', 'operationType', 'projectApproach', 'actions'];

  public planTemplates: PlanTemplate[];
  public operationTypesList: Array<OperationType> = [];
  public projectApproachesList: Array<ProjectApproach> = [];

  public tableDataSource = new MatTableDataSource<PlanTemplate>();

  public selection = new SelectionModel<PlanTemplate>(false, []);

  private dataSubscription: Subscription;

  private lastCreatedPlanTemplateId: number;

  public constructor(
    public dialog: MatDialog,
    private operationTypesService: OperationTypesService,
    private projectApproachesService: ProjectApproachesService,
    private configurationDataService: ConfigurationDataService,
    private configurationService: ConfigurationService
  ) {}

  public ngOnInit(): void {
    this.dataSubscription = this.configurationDataService
      .getPlanTemplates()
      .subscribe((planTemplates: PlanTemplate[]) => {
        this.planTemplates = planTemplates;
        if (this.planTemplates != null) {
          this.tableDataSource.data = this.planTemplates;
        }
      });

    this.dataSubscription = forkJoin([
      this.operationTypesService.getOperationTypes(),
      this.projectApproachesService.getProjectApproaches(),
    ]).subscribe(([operationTypesList, projectApproachesList]) => {
      this.operationTypesList = operationTypesList;
      this.projectApproachesList = projectApproachesList;
    });
  }

  public ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator;
  }

  public ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  public filterProjectApproaches(operationTypeId: number): Array<ProjectApproach> {
    return this.projectApproachesList.filter((projectApproach) => projectApproach.operationTypeId === operationTypeId);
  }

  public openPlanTemplateDialog(): void {
    const dialogInstance = this.dialog.open(PlanTemplateDialogComponent);
    dialogInstance.componentInstance.planTemplatedCreated.subscribe((result) => {
      this.lastCreatedPlanTemplateId = result.id;
    });
  }

  public deletePlanTemplate(id: number): void {
    if (confirm('Wollen Sie diesen Eintrag wirklich löschen?')) {
      this.configurationService.deletePlanTemplate(id).subscribe({
        next: () => {
          this.configurationDataService.setPlanTemplates();
        },
        error: null,
        complete: () => void 0,
      });
    }
  }

  public contentChanged(): void {
    const newPlanTemplateIndex = this.tableDataSource.data.findIndex(
      (element) => element.id === this.lastCreatedPlanTemplateId
    );
    if (newPlanTemplateIndex > -1) {
      this.lastCreatedPlanTemplateId = -1;

      this.paginator.pageIndex = Math.floor(newPlanTemplateIndex / this.paginator.pageSize);
      this.tableDataSource.paginator = this.paginator;

      this.toggleSelectedRow(this.tableDataSource.data[newPlanTemplateIndex]);
    }
  }

  public toggleSelectedRow(element: PlanTemplate): void {
    this.selection.toggle(element);
  }
}
