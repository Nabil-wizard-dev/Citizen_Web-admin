import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignerOuvrierComponent } from './assigner-ouvrier.component';

describe('AssignerOuvrierComponent', () => {
  let component: AssignerOuvrierComponent;
  let fixture: ComponentFixture<AssignerOuvrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignerOuvrierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignerOuvrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
