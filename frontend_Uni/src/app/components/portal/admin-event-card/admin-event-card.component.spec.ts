import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventCardComponent } from './admin-event-card.component';

describe('AdminEventCardComponent', () => {
  let component: AdminEventCardComponent;
  let fixture: ComponentFixture<AdminEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEventCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
