import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOuvrierComponent } from './list-ouvrier.component';

describe('ListOuvrierComponent', () => {
  let component: ListOuvrierComponent;
  let fixture: ComponentFixture<ListOuvrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListOuvrierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOuvrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
