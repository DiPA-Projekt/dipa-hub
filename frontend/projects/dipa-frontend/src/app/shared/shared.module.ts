import { NgModule } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AngularResizeEventModule } from 'angular-resize-event';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { InvalidLinkDialogComponent } from './invalid-link-dialog/invalid-link-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ExternalLinkComponent } from './external-link/external-link.component';
import { InvalidLinkCheckDirective } from './invalid-link-check.directive';
import { DataTableComponent } from './data-table/data-table.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { FilterItemDirective } from './data-table/filter-item.directive';
import { FlexModule } from '@angular/flex-layout';
import { MaterialQuillEditorComponent } from './material-quill-editor/material-quill-editor.component';
import { DownloadLinkComponent } from './download-link/download-link.component';

@NgModule({
  declarations: [
    InvalidLinkDialogComponent,
    ExternalLinkComponent,
    InvalidLinkCheckDirective,
    FilterItemDirective,
    DataTableComponent,
    MaterialQuillEditorComponent,
    DownloadLinkComponent,
  ],
  imports: [
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSelectModule,
    AngularResizeEventModule,
    MatButtonModule,
    MatRadioModule,
    MatToolbarModule,
    MatSidenavModule,
    FormsModule,
    CommonModule,
    MatListModule,
    MatDialogModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatMenuModule,
    ReactiveFormsModule,
    FlexModule,
  ],
  exports: [
    ExternalLinkComponent,
    InvalidLinkCheckDirective,
    FilterItemDirective,
    DataTableComponent,
    MaterialQuillEditorComponent,
    DownloadLinkComponent,
  ],
})
export class SharedModule {}
