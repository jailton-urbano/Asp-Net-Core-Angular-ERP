import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { appConfig as c } from 'app/core/config/app.config'
import { Ticket, TicketData, TicketParameters } from '../types/ticket.types';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(private http: HttpClient) {}

  obterPorParametros(parameters: TicketParameters): Observable<TicketData> {
    let params = new HttpParams();
    
    Object.keys(parameters).forEach(key => {
      if (parameters[key] !== undefined && parameters[key] !== null) params = params.append(key, String(parameters[key]));
    });

    return this.http.get(`${c.api}/Ticket`, { params: params }).pipe(
      map((data: TicketData) => data)
    )
  }

  obterPorCodigo(codTicket: number): Observable<Ticket> {
    const url = `${c.api}/Ticket/${codTicket}`;
    return this.http.get<Ticket>(url).pipe(
      map((obj) => obj)
    );  
}

  criar(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(`${c.api}/Ticket`, ticket).pipe(
      map((obj) => obj)
    );
  }

  atualizar(ticket: Ticket): Observable<Ticket> {
    const url = `${c.api}/Ticket`;
    return this.http.put<Ticket>(url, ticket).pipe(
      map((obj) => obj)
    );
  }

//   deletar(codEquipContrato: number): Observable<EquipamentoContrato> {
//     const url = `${c.api}/EquipamentoContrato/${codEquipContrato}`;
    
//     return this.http.delete<EquipamentoContrato>(url).pipe(
//       map((obj) => obj)
//     );
// }
}
