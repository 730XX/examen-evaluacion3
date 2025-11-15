import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoungeModal } from './lounge-modal';

describe('LoungeModal', () => {
  let component: LoungeModal;
  let fixture: ComponentFixture<LoungeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoungeModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoungeModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
