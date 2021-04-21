import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPostSvgComponent } from './new-post-svg.component';

describe('NewPostSvgComponent', () => {
  let component: NewPostSvgComponent;
  let fixture: ComponentFixture<NewPostSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPostSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPostSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
