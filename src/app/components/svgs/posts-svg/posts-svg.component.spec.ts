import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsSvgComponent } from './posts-svg.component';

describe('PostsSvgComponent', () => {
  let component: PostsSvgComponent;
  let fixture: ComponentFixture<PostsSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostsSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
