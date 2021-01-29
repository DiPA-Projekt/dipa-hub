import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TimelineComponent} from './timeline.component';
import {SidenavComponent} from '../sidenav/sidenav.component';
import {MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {NavMenuListItemComponent} from '../../../shared/nav-menu-list-item/nav-menu-list-item.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatMenuModule} from '@angular/material/menu';
import {MaterialModule} from '../../../material/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {NavService} from '../../../nav.service';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineComponent, SidenavComponent, MatNavList, MatIcon, NavMenuListItemComponent ],
      imports: [ RouterTestingModule,
        HttpClientTestingModule,
        MatMenuModule, MaterialModule,
        BrowserAnimationsModule, FormsModule ],
      providers: [NavService, {
        provide: ActivatedRoute,
        useValue: {
          parent: {
            params: of(
              {
                id: '1'
              }
            )
          }
        }
      }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
