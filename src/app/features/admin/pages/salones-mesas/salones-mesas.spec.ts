import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonesMesas } from './salones-mesas';

describe('SalonesMesas', () => {
  let component: SalonesMesas;
  let fixture: ComponentFixture<SalonesMesas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalonesMesas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalonesMesas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
