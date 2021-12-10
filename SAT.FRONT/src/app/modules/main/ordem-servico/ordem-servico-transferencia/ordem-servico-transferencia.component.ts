import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { OrdemServico } from 'app/core/types/ordem-servico.types'
import { MatSidenav } from '@angular/material/sidenav';
import { Tecnico, TecnicoParameters } from 'app/core/types/tecnico.types';
import { TecnicoService } from 'app/core/services/tecnico.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CustomSnackbarService } from 'app/core/services/custom-snackbar.service';
import moment from 'moment';
import { UserService } from 'app/core/user/user.service';
import { OrdemServicoService } from 'app/core/services/ordem-servico.service';
import { UsuarioSessao } from 'app/core/types/usuario.types';
import { statusServicoConst } from 'app/core/types/status-servico.types';
import { AgendaTecnicoService } from 'app/core/services/agenda-tecnico.service';

@Component({
  selector: 'app-ordem-servico-transferencia',
  templateUrl: 'ordem-servico-transferencia.component.html'
})
export class OrdemServicoTransferenciaComponent implements AfterViewInit
{
  @ViewChild('searchInputControl') searchInputControl: ElementRef;
  @Input() sidenav: MatSidenav;
  @Input() os: OrdemServico;
  tecnicos: Tecnico[];
  isLoading: boolean;
  sessionData: UsuarioSessao;

  constructor (
    private _tecnicoService: TecnicoService,
    private _ordemServicoService: OrdemServicoService,
    private _snack: CustomSnackbarService,
    private _userService: UserService,
    private _agendaTecnicoService: AgendaTecnicoService
  )
  {
    this.sessionData = JSON.parse(this._userService.userSession);
  }

  ngAfterViewInit(): void
  {
    this.obterTecnicos();
    this.registrarEmitters();
  }

  async obterTecnicos()
  {
    const params: TecnicoParameters = {
      indAtivo: 1,
      sortActive: 'nome',
      sortDirection: 'asc',
      codFiliais: this.sessionData?.usuario?.filial?.codFilial?.toString(),
      filter: this.searchInputControl.nativeElement.val,
      pageSize: 10
    }

    const data = await this._tecnicoService
      .obterPorParametros(params)
      .toPromise();

    this.tecnicos = data.items;
  }

  private registrarEmitters(): void
  {
    fromEvent(this.searchInputControl.nativeElement, 'keyup').pipe(
      map((event: any) =>
      {
        return event.target.value;
      })
      , debounceTime(700)
      , distinctUntilChanged()
    ).subscribe((text: string) =>
    {
      this.searchInputControl.nativeElement.val = text;
      this.obterTecnicos();
    });
  }

  transferir(tecnico: Tecnico): void
  {
    this.isLoading = true;
    this.os.codTecnico = tecnico.codTecnico;
    this.os.codUsuarioManut = this.sessionData.usuario.codUsuario;
    this.os.codStatusServico = statusServicoConst.TRANSFERIDO;
    this.os.dataHoraManut = moment().format('YYYY-MM-DD HH:mm:ss');
    this._ordemServicoService.atualizar(this.os).subscribe(() =>
    {
      this.isLoading = false;
      this._snack.exibirToast(`Chamado transferido para ${tecnico.nome.replace(/ .*/, '')}`, 'success');
      this._agendaTecnicoService.criarAgendaTecnico(this.os.codOS).toPromise();
      this.sidenav.close();
    }, error =>
    {
      this.isLoading = false;
      this._snack.exibirToast(error, 'error');
    });
  }
}