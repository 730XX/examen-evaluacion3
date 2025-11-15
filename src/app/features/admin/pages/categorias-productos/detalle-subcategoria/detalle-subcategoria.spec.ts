import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSubcategoria } from './detalle-subcategoria';

describe('DetalleSubcategoria', () => {
  let component: DetalleSubcategoria;
  let fixture: ComponentFixture<DetalleSubcategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleSubcategoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleSubcategoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
