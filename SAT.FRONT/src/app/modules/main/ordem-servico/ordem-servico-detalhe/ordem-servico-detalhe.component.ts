import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdemServicoService } from 'app/core/services/ordem-servico.service';
import { Foto } from 'app/core/types/foto.types';
import { OrdemServico } from 'app/core/types/ordem-servico.types';
import * as L from 'leaflet';
import { MatDialog } from '@angular/material/dialog';
import { OrdemServicoAgendamentoComponent } from '../ordem-servico-agendamento/ordem-servico-agendamento.component';
import { CustomSnackbarService } from 'app/core/services/custom-snackbar.service';
import { AgendamentoService } from 'app/core/services/agendamento.service';
import { MatSidenav } from '@angular/material/sidenav';
import { StatusServico, statusServicoConst } from 'app/core/types/status-servico.types';
import moment from 'moment';
import { UsuarioSessao } from 'app/core/types/usuario.types';
import { UserService } from 'app/core/user/user.service';
import { ConfirmacaoDialogComponent } from 'app/shared/confirmacao-dialog/confirmacao-dialog.component';
import { PerfilEnum } from 'app/core/types/perfil.types';

@Component({
  selector: 'app-ordem-servico-detalhe',
  templateUrl: './ordem-servico-detalhe.component.html',
  styleUrls: ['./ordem-servico-detalhe.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrdemServicoDetalheComponent implements AfterViewInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  codOS: number;
  os: OrdemServico;
  statusServico: StatusServico;
  perfis: any;
  userSession: UsuarioSessao;
  fotos: Foto[] = [];
  map: L.Map;
  ultimoAgendamento: string;
  public get perfilEnum(): typeof PerfilEnum {
    return PerfilEnum;
  }
  
  constructor(
    private _route: ActivatedRoute,
    private _ordemServicoService: OrdemServicoService,
    private _agendamentoService: AgendamentoService,
    private _userService: UserService,    
    private _snack: CustomSnackbarService,
    private _cdr: ChangeDetectorRef,
    private _dialog: MatDialog
  )
  {
      this.userSession = JSON.parse(this._userService.userSession);
  }

  ngAfterViewInit(): void {
    this.codOS = +this._route.snapshot.paramMap.get('codOS');
    this.obterDadosOrdemServico();
  
    this.perfis = PerfilEnum;
    
    this.sidenav.closedStart.subscribe(() => {
      this.obterDadosOrdemServico();
    })

    this._cdr.detectChanges();
  }

  trocarTab(tab: any) {
    if (tab.index !== 4 || !this.os) {
      return;
    }

    this.map = L.map('map', {
      scrollWheelZoom: false,
    }).setView([
      +this.os.localAtendimento.latitude, 
      +this.os.localAtendimento.longitude
    ], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'SAT 2.0'
    }).addTo(this.map);

    var icon = new L.Icon.Default();
    icon.options.shadowSize = [0,0];

    L.marker([
      +this.os.localAtendimento.latitude, 
      +this.os.localAtendimento.longitude
    ])
      .addTo(this.map)
      .setIcon(icon)
      .bindPopup(this.os.localAtendimento.nomeLocal);

    this.map.invalidateSize();
  }

  private async obterDadosOrdemServico() {
    this.os = await this._ordemServicoService.obterPorCodigo(this.codOS).toPromise();
    if (this.os.agendamentos.length) {
      this.ultimoAgendamento = this.os.agendamentos
        .reduce((max, p) => p.dataAgendamento > max ? p.dataAgendamento : max, this.os.agendamentos[0].dataAgendamento);
    }
  }

  agendar() {
    const dialogRef = this._dialog.open(OrdemServicoAgendamentoComponent, {
      data: {
        codOS: this.os.codOS
      }
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this._agendamentoService.criar(data.agendamento).subscribe(() => {
          this._snack.exibirToast('Chamado agendado com sucesso!', 'success');
          this.obterDadosOrdemServico();
        }, e => {
          this._snack.exibirToast(e?.error, 'success');
        });
      }
    });
  }

  cancelar(){
    const dialogRef = this._dialog.open(ConfirmacaoDialogComponent, {
      data: {
        titulo: 'Confirmação',
        message: 'Deseja cancelar este chamado?',
        buttonText: {
          ok: 'Sim',
          cancel: 'Não'
        }
      }
    });  

    dialogRef.afterClosed().subscribe((confirmacao: boolean) => {
      if (confirmacao) {
        let obj = {
          ...this.os,   
          ...{
            dataHoraManut: moment().format('YYYY-MM-DD HH:mm:ss'),
            codUsuarioManut: this.userSession.usuario.codUsuario,
            codStatusServico: statusServicoConst.CANCELADO
          }
        };
    
        Object.keys(obj).forEach((key) => {
          typeof obj[key] == "boolean" ? obj[key] = +obj[key] : obj[key] = obj[key];
        });       

        if(this.os.relatoriosAtendimento.length === 0) {
          this._ordemServicoService.atualizar(obj).subscribe((os: OrdemServico) => {
            this.obterDadosOrdemServico();

            this._snack.exibirToast("Chamado cancelado com sucesso!", "success");  
          });   
        } else{
          this._snack.exibirToast("Chamado não pode ser cancelado, pois possui RAT!", "error"); 
        }

      }
    });
  }
}