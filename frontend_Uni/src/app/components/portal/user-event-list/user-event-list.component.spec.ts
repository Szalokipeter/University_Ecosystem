import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventListComponent } from './user-event-list.component';

describe('UserEventListComponent', () => {
  let component: UserEventListComponent;
  let fixture: ComponentFixture<UserEventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEventListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
