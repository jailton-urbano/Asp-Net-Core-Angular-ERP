import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { appConfig as c } from 'app/core/config/app.config'
import { AgendaTecnico, AgendaTecnicoParameters, ViewAgendaTecnicoRecurso } from 'app/core/types/agenda-tecnico.types';

@Injectable({
    providedIn: 'root'
})
export class AgendaTecnicoService
{
    constructor (private _httpClient: HttpClient) { }

    obterAgendaTecnico(parameters: AgendaTecnicoParameters): Observable<AgendaTecnico[]>
    {
        let params = new HttpParams()

        Object.keys(parameters).forEach(key =>
        {
            if (parameters[key] !== undefined && parameters[key] !== null)
                params = params.append(key, String(parameters[key]));
        });

        return this._httpClient.get(`${c.api}/AgendaTecnico/Agenda`, { params: params }).pipe(map((data: AgendaTecnico[]) => data))
    }

    ordenarAgendaTecnico(parameters: AgendaTecnicoParameters): Observable<AgendaTecnico[]>
    {
        let params = new HttpParams()

        Object.keys(parameters).forEach(key =>
        {
            if (parameters[key] !== undefined && parameters[key] !== null)
                params = params.append(key, String(parameters[key]));
        });

        return this._httpClient.get(`${c.api}/AgendaTecnico/Ordenar`, { params: params }).pipe(map((data: AgendaTecnico[]) => data))
    }

    obterPorParametros(parameters: AgendaTecnicoParameters): Observable<ViewAgendaTecnicoRecurso[]>
    {
        let params = new HttpParams()

        Object.keys(parameters).forEach(key =>
        {
            if (parameters[key] !== undefined && parameters[key] !== null)
                params = params.append(key, String(parameters[key]));
        });

        return this._httpClient.get(`${c.api}/AgendaTecnico`, { params: params }).pipe(map((data: ViewAgendaTecnicoRecurso[]) => data))
    }

    criarAgendaTecnico(codOS: number, codTecnico: number): Observable<AgendaTecnico>
    {
        const url = `${c.api}/AgendaTecnico/CriarOS/${codOS},${codTecnico}`;
        return this._httpClient.get<AgendaTecnico>(url).pipe(map((obj) => obj));
    }

    deletarAgendaTecnico(codOS: number): Observable<AgendaTecnico>
    {
        const url = `${c.api}/AgendaTecnico/DeletarOS/${codOS}`;
        return this._httpClient.get<AgendaTecnico>(url).pipe(map((obj) => obj));
    }

    obterPorCodigo(codAgendamento: number): Observable<AgendaTecnico> 
    {
        const url = `${c.api}/AgendaTecnico/${codAgendamento}`;
        return this._httpClient.get<AgendaTecnico>(url).pipe(map((obj) => obj));
    }

    atualizar(agendamento: AgendaTecnico): Observable<AgendaTecnico> 
    {
        const url = `${c.api}/AgendaTecnico`;
        return this._httpClient.put<AgendaTecnico>(url, agendamento).pipe(map((obj) => obj));
    }

    deletar(codAgendamento: number): Observable<AgendaTecnico> 
    {
        const url = `${c.api}/AgendaTecnico/${codAgendamento}`;
        return this._httpClient.delete<AgendaTecnico>(url).pipe(map((obj) => obj));
    }

    criar(agenda: AgendaTecnico): Observable<AgendaTecnico> 
    {
        const url = `${c.api}/AgendaTecnico`;
        return this._httpClient.post<AgendaTecnico>(url, agenda).pipe(map((obj) => obj));
    }
}