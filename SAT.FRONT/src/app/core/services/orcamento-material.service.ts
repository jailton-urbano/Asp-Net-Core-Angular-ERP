import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { appConfig as c } from 'app/core/config/app.config'
import { OrcamentoMaterial } from '../types/orcamento.material.types';

@Injectable({
    providedIn: 'root'
})
export class OrcamentoMaterialService
{
    constructor (private http: HttpClient) { }

    criar(material: OrcamentoMaterial): Observable<OrcamentoMaterial>
    {
        return this.http.post<OrcamentoMaterial>(`${c.api}/OrcamentoMaterial`, material).pipe(map((obj) => obj));
    }

    atualizar(material: OrcamentoMaterial): Observable<OrcamentoMaterial>
    {
        const url = `${c.api}/OrcamentoMaterial`;
        return this.http.put<OrcamentoMaterial>(url, material).pipe(map((obj) => obj));
    }

    deletar(codOrcMaterial: number): Observable<OrcamentoMaterial>
    {
        const url = `${c.api}/OrcamentoMaterial/${codOrcMaterial}`;
        return this.http.delete<OrcamentoMaterial>(url).pipe(map((obj) => obj));
    }
}