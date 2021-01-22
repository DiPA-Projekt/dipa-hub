import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SidenavComponent} from '../sidenav/sidenav.component';
import {MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {MaterialModule} from '../../../material/material.module';

// import {NavMenuListItemComponent} from '../../shared/nav-menu-list-item/nav-menu-list-item.component';
import {NavService} from '../../../nav.service';

import { TemplatesViewComponent } from './templates-view.component';

describe('TemplatesViewComponent', () => {
  let component: TemplatesViewComponent;
  let fixture: ComponentFixture<TemplatesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatesViewComponent, SidenavComponent, MatNavList, MatIcon],
      imports: [HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule, MaterialModule],
      providers: [NavService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
