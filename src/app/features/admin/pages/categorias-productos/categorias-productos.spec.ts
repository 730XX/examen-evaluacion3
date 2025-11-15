import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasProductos } from './categorias-productos';

describe('CategoriasProductos', () => {
  let component: CategoriasProductos;
  let fixture: ComponentFixture<CategoriasProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriasProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriasProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
