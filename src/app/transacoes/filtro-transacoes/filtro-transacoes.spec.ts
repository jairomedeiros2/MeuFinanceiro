import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltroTransacoes } from './filtro-transacoes';

describe('FiltroTransacoes', () => {
  let component: FiltroTransacoes;
  let fixture: ComponentFixture<FiltroTransacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroTransacoes],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltroTransacoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
