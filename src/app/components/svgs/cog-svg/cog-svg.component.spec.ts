import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CogSvgComponent } from './cog-svg.component';

describe('CogSvgComponent', () => {
  let component: CogSvgComponent;
  let fixture: ComponentFixture<CogSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CogSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CogSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
