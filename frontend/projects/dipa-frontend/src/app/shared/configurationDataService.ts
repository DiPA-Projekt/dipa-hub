import { Injectable } from '@angular/core';
import { ConfigurationService, MilestoneTemplate, PlanTemplate } from 'dipa-api-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationDataService {
  public milestoneTemplates: BehaviorSubject<MilestoneTemplate[]> = new BehaviorSubject<MilestoneTemplate[]>(null);
  public planTemplates: BehaviorSubject<PlanTemplate[]> = new BehaviorSubject<PlanTemplate[]>(null);

  public constructor(private configurationService: ConfigurationService) {
    this.setPlanTemplates();
  }

  public getMilestoneTemplates(): Observable<MilestoneTemplate[]> {
    return this.milestoneTemplates;
  }

  public setMilestoneTemplates(planTemplateId: number): void {
    this.configurationService.getMilestoneTemplates(planTemplateId).subscribe((data: MilestoneTemplate[]) => {
      this.milestoneTemplates.next(data);
    });
  }

  public getPlanTemplates(): Observable<PlanTemplate[]> {
    return this.planTemplates;
  }

  public setPlanTemplates(): void {
    this.configurationService.getPlanTemplates().subscribe((data: PlanTemplate[]) => {
      this.planTemplates.next(data);
    });
  }
}
