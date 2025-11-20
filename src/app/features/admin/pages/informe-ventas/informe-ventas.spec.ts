import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeVentas } from './informe-ventas';

describe('InformeVentas', () => {
  let component: InformeVentas;
  let fixture: ComponentFixture<InformeVentas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformeVentas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformeVentas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
