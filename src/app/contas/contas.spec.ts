import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Contas } from './contas';

describe('Contas', () => {
  let component: Contas;
  let fixture: ComponentFixture<Contas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contas],
    }).compileComponents();

    fixture = TestBed.createComponent(Contas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
