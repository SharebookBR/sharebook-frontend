import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Cep } from '../../models/cep';

@Injectable()
export class CepService {

  resultado: Cep;
  constructor(private http: HttpClient) { }

  buscar(cep: string) {
    return this.http
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .map(data => this.resultado = this.converterRespostaParaCep(data));
  }

  private converterRespostaParaCep(cepNaResposta): Cep {
    const cep = new Cep();

    cep.cep = cepNaResposta.cep;
    cep.logradouro = cepNaResposta.logradouro;
    cep.complemento = cepNaResposta.complemento;
    cep.bairro = cepNaResposta.bairro;
    cep.cidade = cepNaResposta.localidade;
    cep.estado = cepNaResposta.uf;
    return cep;
  }
}
