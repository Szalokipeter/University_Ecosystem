import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsFocusComponent } from './news-focus.component';

describe('NewsFocusComponent', () => {
  let component: NewsFocusComponent;
  let fixture: ComponentFixture<NewsFocusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsFocusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsFocusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
