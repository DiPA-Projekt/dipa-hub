import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';
import Utils from '../utils';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { Timeline } from 'dipa-api-client';

interface ColumnFilter {
  name: string;
  columnProp: string;
  options: string[];
  modelValue: string[];
}

interface EventEntry {
  id: number;
  seriesId: number;
  eventType: string; // TYPE_APPT_SERIES, TYPE_SINGLE_APPOINTMENT, TYPE_RECURRING_EVENT
  title: string;
  dateTime: string;
  duration: number;
  status: string; // OPEN, DONE
  mandatory: boolean;
  visibility: boolean;
}

enum FilterMode {
  text,
  date,
  select,
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, AfterViewInit {
  public static filterMode = FilterMode;

  @Input() public title: string;
  @Input() public icon: string;
  @Input() public displayedColumns = [];
  @Input() public data: EventEntry[] = [];
  @Input() public timelineData: Timeline;
  @Input() public editable: boolean;
  @Output() public statusChanged = new EventEmitter();
  @Output() public visibilityChanged = new EventEmitter();
  @Output() public filterChanged = new EventEmitter();

  @ViewChild(MatPaginator) public paginator: MatPaginator;

  public utils = Utils;

  public selection = new SelectionModel<EventEntry>(true, []);

  public tableDataSource = new MatTableDataSource<EventEntry>();

  public filterValues: { [key: string]: string[] } = {};

  public filterSelectObj: ColumnFilter[] = [];
  public filterNameObj: ColumnFilter[] = [];

  public filterTypeList = [
    { columnName: 'eventType', filterMode: DataTableComponent.filterMode.select },
    { columnName: 'dateTime', filterMode: DataTableComponent.filterMode.date },
    { columnName: 'title', filterMode: DataTableComponent.filterMode.text },
  ];

  public schedulePeriods = [
    { key: 'CUSTOM', value: 'ausgewählter Zeitraum' },
    { key: '1_WEEK', value: '1 Woche' },
    { key: '2_WEEKS', value: '2 Wochen' },
    { key: '3_WEEKS', value: '3 Wochen' },
    { key: '4_WEEKS', value: '4 Wochen' },
    { key: '2_MONTHS', value: '2 Monate' },
    { key: '3_MONTHS', value: '3 Monate' },
    { key: '6_MONTHS', value: '6 Monate' },
    { key: 'PROJECT', value: 'Projektende' },
  ];

  public apptStartDate: string;
  public apptEndDate: string;
  public periodTemplate: string;

  public isAllSelected = false;

  public constructor(private datePipe: DatePipe) {
    this.filterSelectObj = [
      {
        name: 'eventType',
        columnProp: 'eventType',
        options: [],
        modelValue: [],
      },
    ];

    this.filterNameObj = [
      {
        name: 'title',
        columnProp: 'title',
        options: [],
        modelValue: [],
      },
    ];
  }

  public ngOnInit(): void {
    this.tableDataSource.filterPredicate = this.getFilterPredicate();

    this.tableDataSource.data = this.data;
    this.filterSelectObj = this.filterSelectObj.filter((o: ColumnFilter) => {
      o.options = this.getFilterObject(this.tableDataSource.data, o.columnProp);
      o.modelValue = this.getFilterObject(this.tableDataSource.data, o.columnProp);
    });
  }

  public ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator;
  }

  public getEventTypeOptions(): string[] {
    return this.getFilterObject(this.tableDataSource.data, 'eventType');
  }

  public masterToggle(): void {
    let rows;

    this.isAllSelected = !this.isAllSelected;

    if (this.isAllSelected) {
      rows = this.tableDataSource.data.filter((rowB) => rowB.visibility === false);
      this.selection.select(...rows);
    } else {
      rows = this.tableDataSource.data.filter((rowB) => rowB.visibility === true);
      this.selection.clear();
    }

    this.visibilityChanged.emit(rows);
  }

  public changeStatus(event: MatSelectChange, element: EventEntry): void {
    element.status = event.value as string;
    this.statusChanged.emit(element);
  }

  public changeVisibility(row: EventEntry): void {
    let rows: EventEntry[];

    if (row.seriesId > -1) {
      rows = this.tableDataSource.data.filter((rowB) => rowB.seriesId === row.seriesId);
      rows.forEach((currRow) => {
        this.selection.toggle(currRow);
      });
    } else {
      rows = [row];
      this.selection.toggle(row);
    }

    this.visibilityChanged.emit(rows);
  }

  public changePeriodTemplates(value: string, columnKey: string): void {
    this.apptStartDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    let now = new Date();
    switch (value) {
      case 'CUSTOM':
        return;
      case '1_WEEK':
        now.setDate(now.getDate() + 7);
        break;
      case '2_WEEKS':
        now.setDate(now.getDate() + 2 * 7);
        break;
      case '3_WEEKS':
        now.setDate(now.getDate() + 3 * 7);
        break;
      case '4_WEEKS':
        now.setDate(now.getDate() + 4 * 7);
        break;
      case '2_MONTHS':
        now.setMonth(now.getMonth() + 2);
        break;
      case '3_MONTHS':
        now.setMonth(now.getMonth() + 3);
        break;
      case '6_MONTHS':
        now.setMonth(now.getMonth() + 6);
        break;
      case 'PROJECT':
        now = new Date(this.timelineData.end);
        break;
    }
    this.apptEndDate = this.datePipe.transform(now, 'yyyy-MM-dd');

    this.setDateFilter(columnKey);
  }

  public applyFilter(): void {
    this.tableDataSource.filter = JSON.stringify(this.filterValues);
    this.filterChanged.emit(this.tableDataSource.filteredData);
  }

  public onChangeAppointmentPeriodStart(event: Event, columnKey: string): void {
    if ((event.target as HTMLInputElement).value !== null) {
      this.apptStartDate = (event.target as HTMLInputElement).value;
      this.periodTemplate = 'CUSTOM';
      this.setDateFilter(columnKey);
    }
  }

  public onChangeAppointmentPeriodEnd(event: Event, columnKey: string): void {
    if ((event.target as HTMLInputElement).value !== null) {
      this.apptEndDate = (event.target as HTMLInputElement).value;
      this.periodTemplate = 'CUSTOM';
      this.setDateFilter(columnKey);
    }
  }

  private resetDateFilter(): void {
    this.apptStartDate = null;
    this.apptEndDate = null;
    this.periodTemplate = null;
  }

  private setDateFilter(columnKey: string): void {
    if (this.apptStartDate != null && this.apptEndDate != null) {
      this.filterValues[columnKey] = [this.apptStartDate, this.apptEndDate];
      this.applyFilter();
    }
  }

  private getFilterPredicate<T>(): (data: T, filter: string) => boolean {
    return (data: T, filter: string): boolean => {
      const searchTerms = JSON.parse(filter) as { [key: string]: string[] };
      for (const col in searchTerms) {
        if (searchTerms[col].toString() === '') {
          delete this.filterValues[col];
          delete searchTerms[col];
        }
      }
      return this.filterAll(data, searchTerms);
    };
  }

  private filterAll<T>(data: T, searchTerms: { [key: string]: string[] }): boolean {
    let allFound = true;

    for (const col in searchTerms) {
      if (searchTerms.hasOwnProperty(col)) {
        const filterMode = this.filterTypeList.find((elem) => elem.columnName === col)?.filterMode;
        allFound = allFound && this.filterColumn(filterMode, data[col], searchTerms[col]);
      }
    }
    return allFound;
  }

  private filterColumn(filterMode, searchCol: string, searchTerms: string[]): boolean {
    let found = false;

    switch (filterMode) {
      case DataTableComponent.filterMode.text:
        if (
          searchCol != null &&
          searchCol.toString().toLocaleLowerCase().indexOf(searchTerms.toString().toLocaleLowerCase()) !== -1
        ) {
          found = true;
        }
        break;
      case DataTableComponent.filterMode.select:
        searchTerms.forEach((searchTerm) => {
          if (searchCol.toString().indexOf(searchTerm) !== -1) {
            found = true;
          }
        });
        break;
      case DataTableComponent.filterMode.date:
        const apptDate = Utils.createDateAtMidnight(searchCol);
        if (
          apptDate >= Utils.createDateAtMidnight(new Date(this.apptStartDate)) &&
          apptDate <= Utils.createDateAtMidnight(new Date(this.apptEndDate))
        ) {
          found = true;
        }
        break;
    }
    return found;
  }

  private getFilterObject<T>(fullObj: T[], key: string): string[] {
    const filterSet: string[] = [];
    fullObj.forEach((obj: T) => {
      if (!filterSet.includes(obj[key])) {
        filterSet.push(obj[key]);
      }
      return obj;
    });
    return filterSet;
  }
}
