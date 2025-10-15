import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ex2PluginComponent } from './ex2-plugin.component';

describe('Ex2PluginComponent', () => {
  let component: Ex2PluginComponent;
  let fixture: ComponentFixture<Ex2PluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ex2PluginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ex2PluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
