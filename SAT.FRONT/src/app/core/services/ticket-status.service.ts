import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { appConfig as c } from 'app/core/config/app.config'
import { Ticket, TicketData, TicketParameters, TicketStatus, TicketStatusData, TicketStatusParameters } from '../types/ticket.types';

@Injectable({
  providedIn: 'root'
})
export class TicketStatusService {
  constructor(private http: HttpClient) {}

  obterPorParametros(parameters: TicketStatusParameters): Observable<TicketStatusData> {
    let params = new HttpParams();
    

    return this.http.get(`${c.api}/TicketStatus`, { params: params }).pipe(
      map((data: TicketStatusData) => data)
    )
  }

  obterPorCodigo(codStatus: number): Observable<TicketStatus> {
    const url = `${c.api}/TicketStatus/${codStatus}`;
    return this.http.get<TicketStatus>(url).pipe(
      map((obj) => obj)
    );  
}

  criar(ticketStatus: TicketStatus): Observable<TicketStatus> {
    return this.http.post<TicketStatus>(`${c.api}/TicketStatus`, 
      ticketStatus).pipe(
      map((obj) => obj)
    );
  }

  atualizar(ticketStatus: TicketStatus): Observable<TicketStatus> {
    const url = `${c.api}/TicketStatus`;
    return this.http.put<TicketStatus>(url, ticketStatus).pipe(
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
