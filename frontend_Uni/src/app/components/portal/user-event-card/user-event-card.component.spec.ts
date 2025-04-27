import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventCardComponent } from './user-event-card.component';

describe('UserEventCardComponent', () => {
  let component: UserEventCardComponent;
  let fixture: ComponentFixture<UserEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEventCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
