import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarSvgComponent } from './avatar-svg.component';

describe('AvatarSvgComponent', () => {
  let component: AvatarSvgComponent;
  let fixture: ComponentFixture<AvatarSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
