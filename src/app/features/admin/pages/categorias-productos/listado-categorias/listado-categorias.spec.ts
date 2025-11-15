import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoCategorias } from './listado-categorias';

describe('ListadoCategorias', () => {
  let component: ListadoCategorias;
  let fixture: ComponentFixture<ListadoCategorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListadoCategorias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoCategorias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
