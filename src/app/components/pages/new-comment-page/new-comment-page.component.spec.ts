import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCommentPageComponent } from './new-comment-page.component';

describe('NewCommentPageComponent', () => {
  let component: NewCommentPageComponent;
  let fixture: ComponentFixture<NewCommentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCommentPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCommentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
