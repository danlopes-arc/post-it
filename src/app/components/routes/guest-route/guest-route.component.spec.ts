import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestRouteComponent } from './guest-route.component';

describe('GuestRouteComponent', () => {
  let component: GuestRouteComponent;
  let fixture: ComponentFixture<GuestRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
