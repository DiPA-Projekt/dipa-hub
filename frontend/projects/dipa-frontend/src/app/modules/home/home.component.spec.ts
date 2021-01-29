import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {RouterTestingModule} from '@angular/router/testing';
import {NavMenuListItemComponent} from '../../shared/nav-menu-list-item/nav-menu-list-item.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavService} from '../../nav.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent, MatNavList, MatIcon, MatSidenavContainer,
        MatSidenav, MatSidenavContent, NavMenuListItemComponent, MatNavList],
      imports: [ BrowserAnimationsModule, RouterTestingModule, HttpClientTestingModule ],
      providers: [NavService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
