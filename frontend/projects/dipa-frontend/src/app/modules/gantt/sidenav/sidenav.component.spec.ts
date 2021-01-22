import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SidenavComponent} from './sidenav.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NavMenuListItemComponent} from '../../../shared/nav-menu-list-item/nav-menu-list-item.component';
import {NavService} from '../../../nav.service';
import {MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavComponent, NavMenuListItemComponent, MatNavList, MatIcon ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [NavService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
