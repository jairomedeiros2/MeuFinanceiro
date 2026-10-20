import { TestBed } from '@angular/core/testing';
import { TransacaoService } from './transacao';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TransacaoService', () => {
  let service: TransacaoService;

  beforeEach(() => {
TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()],
});    service = TestBed.inject(TransacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
