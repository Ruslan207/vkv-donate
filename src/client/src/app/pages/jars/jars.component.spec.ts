import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JarsComponent } from './jars.component';

describe('JarsComponent', () => {
  let component: JarsComponent;
  let fixture: ComponentFixture<JarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JarsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
