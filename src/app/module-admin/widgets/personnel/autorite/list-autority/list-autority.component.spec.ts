import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAutorityComponent } from './list-autority.component';

describe('ListAutorityComponent', () => {
  let component: ListAutorityComponent;
  let fixture: ComponentFixture<ListAutorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListAutorityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAutorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
