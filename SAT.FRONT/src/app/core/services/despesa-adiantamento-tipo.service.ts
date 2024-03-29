import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { appConfig as c } from 'app/core/config/app.config'
import { DespesaAdiantamentoData, DespesaAdiantamentoTipoData, DespesaAdiantamentoTipoParameters } from '../types/despesa-adiantamento.types';

@Injectable({
    providedIn: 'root'
})
export class DespesaAdiantamentoTipoService
{
    constructor (private http: HttpClient) { }

    obterPorParametros(parameters: DespesaAdiantamentoTipoParameters): Observable<DespesaAdiantamentoTipoData>
    {
        let params = new HttpParams();

        Object.keys(parameters).forEach(key =>
        {
            if (parameters[key] !== undefined && parameters[key] !== null) params = params.append(key, String(parameters[key]));
        });

        return this.http.get(
            `${c.api}/DespesaAdiantamentoTipo`, { params: params })
            .pipe(map((data: DespesaAdiantamentoData) => data));
    }
}