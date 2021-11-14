import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MilestoneTemplate } from 'dipa-api-client';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MilestoneTemplateDialogComponent } from '../milestone-template-dialog/milestone-template-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationDataService } from '../../../shared/configurationDataService';
import { ConfigurationService, PlanTemplate } from 'dipa-api-client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-milestone-templates',
  templateUrl: './milestone-templates.component.html',
  styleUrls: ['./milestone-templates.component.scss'],
})
export class MilestoneTemplatesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public planTemplate: PlanTemplate;

  public displayedColumns = ['index', 'name', 'dateOffset', 'dateDiff', 'actions'];
  public lastElementDateOffset = 0;

  public tableDataSource = new MatTableDataSource<MilestoneTemplate>();

  public selection = new SelectionModel<MilestoneTemplate>(false, []);

  private dataSubscription: Subscription;

  public constructor(
    public dialog: MatDialog,
    private configurationDataService: ConfigurationDataService,
    private configurationService: ConfigurationService
  ) {}

  public ngOnInit(): void {
    this.dataSubscription = this.configurationDataService
      .getMilestoneTemplates()
      .subscribe((data: MilestoneTemplate[]) => {
        if (data != null) {
          this.tableDataSource.data = data;
        }
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.planTemplate) {
      this.configurationDataService.setMilestoneTemplates(this.planTemplate.id);
    }
  }

  public ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  public openMilestoneTemplateDialog(planTemplate: PlanTemplate): void {
    this.dialog.open(MilestoneTemplateDialogComponent, {
      data: { planTemplate },
    });
  }

  public deleteMilestoneTemplate(id: number): void {
    if (confirm('Wollen Sie diesen Eintrag wirklich löschen?')) {
      this.configurationService.deleteMilestoneTemplate(id).subscribe({
        next: () => {
          this.configurationDataService.setMilestoneTemplates(this.planTemplate.id);
        },
        error: null,
        complete: () => void 0,
      });
    }
  }
}
