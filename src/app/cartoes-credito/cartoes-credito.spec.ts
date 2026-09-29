import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartoesCredito } from './cartoes-credito';

describe('CartoesCredito', () => {
  let component: CartoesCredito;
  let fixture: ComponentFixture<CartoesCredito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartoesCredito],
    }).compileComponents();

    fixture = TestBed.createComponent(CartoesCredito);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
