import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSupportPageComponent } from './custom-support-page.component';

describe('CustomSupportPageComponent', () => {
  let component: CustomSupportPageComponent;
  let fixture: ComponentFixture<CustomSupportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomSupportPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSupportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
