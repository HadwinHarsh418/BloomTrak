import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpanTrackComponent } from './span-track.component';

describe('SpanTrackComponent', () => {
  let component: SpanTrackComponent;
  let fixture: ComponentFixture<SpanTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpanTrackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpanTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
