import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalNewsComponent } from './portal-news.component';

describe('PortalNewsComponent', () => {
  let component: PortalNewsComponent;
  let fixture: ComponentFixture<PortalNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortalNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
