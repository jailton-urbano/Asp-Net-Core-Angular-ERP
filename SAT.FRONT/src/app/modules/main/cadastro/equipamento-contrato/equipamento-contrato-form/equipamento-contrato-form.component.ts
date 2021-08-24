import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AutorizadaService } from 'app/core/services/autorizada.service';
import { ClienteService } from 'app/core/services/cliente.service';
import { ContratoEquipamentoService } from 'app/core/services/contrato-equipamento.service';
import { ContratoSLAService } from 'app/core/services/contrato-sla.service';
import { ContratoService } from 'app/core/services/contrato.service';
import { CustomSnackbarService } from 'app/core/services/custom-snackbar.service';
import { EquipamentoContratoService } from 'app/core/services/equipamento-contrato.service';
import { FilialService } from 'app/core/services/filial.service';
import { LocalAtendimentoService } from 'app/core/services/local-atendimento.service';
import { RegiaoAutorizadaService } from 'app/core/services/regiao-autorizada.service';
import { AcordoNivelServico } from 'app/core/types/acordo-nivel-servico.types';
import { Autorizada, AutorizadaParameters } from 'app/core/types/autorizada.types';
import { Cliente, ClienteParameters } from 'app/core/types/cliente.types';
import { ContratoEquipamentoParameters } from 'app/core/types/contrato-equipamento.types';
import { Contrato, ContratoParameters } from 'app/core/types/contrato.types';
import { EquipamentoContrato, PontoEstrategicoEnum } from 'app/core/types/equipamento-contrato.types';
import { Equipamento } from 'app/core/types/equipamento.types';
import { Filial } from 'app/core/types/filial.types';
import { LocalAtendimento, LocalAtendimentoParameters } from 'app/core/types/local-atendimento.types';
import { RegiaoAutorizadaParameters } from 'app/core/types/regiao-autorizada.types';
import { Regiao, RegiaoParameters } from 'app/core/types/regiao.types';
import { UsuarioSessionData } from 'app/core/types/usuario.types';
import { UserService } from 'app/core/user/user.service';
import moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime, delay, filter, first, map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-equipamento-contrato-form',
  templateUrl: './equipamento-contrato-form.component.html'
})
export class EquipamentoContratoFormComponent implements OnInit, OnDestroy {
  codEquipContrato: number;
  equipamento: EquipamentoContrato;
  isAddMode: boolean;
  form: FormGroup;
  equipamentoContrato: EquipamentoContrato;
  clientes: Cliente[] = [];
  contratos: Contrato[] = [];
  modelos: Equipamento[] = [];
  slas: AcordoNivelServico[] = [];
  autorizadas: Autorizada[] = [];
  regioes: Regiao[] =[];
  filiais: Filial[] = [];
  locais: LocalAtendimento[] = [];
  locaisFiltro: FormControl = new FormControl();
  pontosEstrategicos: any [] =[]
  userSession: UsuarioSessionData;
  protected _onDestroy = new Subject<void>();

  constructor(
    private _formBuilder: FormBuilder,
    private _equipamentoContratoService: EquipamentoContratoService,
    private _contratoService: ContratoService,
    private _route: ActivatedRoute,
    private _snack: CustomSnackbarService,
    private _location: Location,
    private _clienteService: ClienteService,
    private _contratoEquipamentoService: ContratoEquipamentoService,
    private _contratoSLAService: ContratoSLAService,
    private _autorizadaService: AutorizadaService,
    private _regiaoAutorizadaService: RegiaoAutorizadaService,
    private _localAtendimentoService: LocalAtendimentoService,
    private _filialService: FilialService,
    private _userService: UserService
  ) {
    this.userSession = JSON.parse(this._userService.userSession);
  }

  async ngOnInit() {
    this.codEquipContrato = +this._route.snapshot.paramMap.get('codEquipContrato');
    this.isAddMode = !this.codEquipContrato;
    this.inicializarForm();
    this.obterClientes();
    this.obterFiliais();
    this.obterPontosEstrategicos();

    this.form.controls['codCliente'].valueChanges.subscribe(async () => {
      this.obterContratos();
    });

    this.form.controls['codContrato'].valueChanges.subscribe(async () => {
      this.obterModelos();
    });

    this.form.controls['codEquip'].valueChanges.subscribe(async () => {
      this.obterSLAs();
    });

    this.form.controls['codFilial'].valueChanges.subscribe(async () => {
      this.obterAutorizadas();
    });

    this.form.controls['codAutorizada'].valueChanges.subscribe(async () => {
      this.obterRegioes();
    });

    this.form.controls['codRegiao'].valueChanges.subscribe(async () => {
      this.obterLocais();
    });

    this.locaisFiltro.valueChanges.pipe(
      filter(query => !!query),
      debounceTime(700),
      delay(500),
      takeUntil(this._onDestroy),
      map(async query => { this.obterLocais(query) })
    ).subscribe(() => {});

    if (!this.isAddMode) {
      this._equipamentoContratoService.obterPorCodigo(this.codEquipContrato)
      .pipe(first())
      .subscribe(data => {
        this.form.patchValue(data);
        this.equipamentoContrato = data;
      });
    }
  }

  private inicializarForm() {
    this.form = this._formBuilder.group({
      codEquipContrato: [
        {
          value: undefined,
          disabled: true
        }, Validators.required
      ],
      numSerie: [undefined, Validators.required],
      codEquip: [undefined, [Validators.required]],
      codCliente: [undefined, Validators.required],
      codSLA: [undefined, Validators.required],
      codContrato: [undefined, Validators.required],
      codPosto: [undefined, Validators.required],
      codFilial: [undefined, Validators.required],
      codRegiao: [undefined, Validators.required],
      codAutorizada: [undefined, Validators.required],
      distanciaPatRes: [undefined],
      dataInicGarantia: [undefined],
      dataFimGarantia: [undefined],
      dataAtivacao: [undefined],
      dataDesativacao: [undefined],
      indReceita: [undefined],
      indRepasse: [undefined],
      indRepasseIndividual: [undefined],
      indInstalacao: [undefined],
      indAtivo: [undefined],
      indRAcesso: [undefined],
      indRHorario: [undefined],
      indSemat: [undefined],
      indVerao: [undefined],
      indPAE: [undefined],
      pontoEstrategico: [undefined],
    });
  }

  private async obterClientes() {
    const params: ClienteParameters = {
      sortActive: 'nomeFantasia',
      sortDirection: 'asc',
      indAtivo: 1,
      pageSize: 300
    }

    const data = await this._clienteService.obterPorParametros(params).toPromise();
    this.clientes = data.clientes;
  }

  private async obterContratos() {
    const codCliente = this.form.controls['codCliente'].value;

    const params: ContratoParameters = {
      sortActive: 'nomeContrato',
      sortDirection: 'asc',
      indAtivo: 1,
      codCliente: codCliente,
      pageSize: 100
    }

    const data = await this._contratoService.obterPorParametros(params).toPromise();
    this.contratos = data.contratos;
  }

  private async obterModelos() {
    const codContrato = this.form.controls['codContrato'].value;

    const params: ContratoEquipamentoParameters = {
      pageSize: 100,
      codContrato: codContrato
    }

    const data = await this._contratoEquipamentoService.obterPorParametros(params).toPromise();
    this.modelos = data.contratosEquipamento.map(ce => ce.equipamento);
  }

  private async obterSLAs() {
    const codEquip = this.form.controls['codEquip'].value;

    const params: ContratoEquipamentoParameters = {
      pageSize: 100,
      codContrato: codEquip
    }

    const data = await this._contratoSLAService.obterPorParametros(params).toPromise();
    this.slas = data.contratosSLA.map(ce => ce.sla);
  }

  private async obterFiliais() {
    const params: ClienteParameters = {
      sortActive: 'nomeFilial',
      sortDirection: 'asc',
      indAtivo: 1,
      pageSize: 100
    }

    const data = await this._filialService.obterPorParametros(params).toPromise();
    this.filiais = data.filiais;
  }

  private async obterRegioes() {
    const codAutorizada = this.form.controls['codAutorizada'].value;

    const params: RegiaoAutorizadaParameters = {
      codAutorizada: codAutorizada,
      indAtivo: 1,
      pageSize: 100
    }

    const data = await this._regiaoAutorizadaService.obterPorParametros(params).toPromise();
    this.regioes = data.regioesAutorizadas.map(ra => ra.regiao);
  }

  private async obterAutorizadas() {
    const codFilial = this.form.controls['codFilial'].value;

    const params: AutorizadaParameters = {
      sortActive: 'nomeFantasia',
      sortDirection: 'asc',
      indAtivo: 1,
      codFilial: codFilial,
      pageSize: 100
    }

    const data = await this._autorizadaService.obterPorParametros(params).toPromise();
    this.autorizadas = data.autorizadas;
  }

  private async obterLocais(filtro: string='') {
    const codRegiao = this.form.controls['codRegiao'].value;
    const codAutorizada = this.form.controls['codAutorizada'].value;

    const params: LocalAtendimentoParameters = {
      sortActive: 'nomeLocal',
      sortDirection: 'asc',
      indAtivo: 1,
      filter: filtro,
      codAutorizada: codAutorizada,
      codRegiao: codRegiao,
      pageSize: 100
    }

    const data = await this._localAtendimentoService.obterPorParametros(params).toPromise();
    this.locais = data.locaisAtendimento.slice();
  }

  private obterPontosEstrategicos(): void {
    const data = Object.keys(PontoEstrategicoEnum).filter((element) => {
      return isNaN(Number(element));
    });

    data.forEach((tr, i) => {
      this.pontosEstrategicos.push({
        codPontoEstrategico: String(i),
        nomePontoEstrategico: tr
      })
    });
  }

  salvar(): void {
    this.isAddMode ? this.criar() : this.atualizar();
  }

  atualizar(): void {
    const form: any = this.form.getRawValue();


    let obj = {
      ...this.equipamento,
      ...form,
      ...{
        dataHoraManut: moment().format('YYYY-MM-DD HH:mm:ss'),
        dataManutencao: moment().format('YYYY-MM-DD HH:mm:ss'),
        codUsuarioManut: this.userSession.usuario.codUsuario,
        codUsuarioManutencao: this.userSession.usuario.codUsuario,
        indReceita: +form.indReceita,
        indRepasse: +form.indRepasse,
        indRepasseIndividual: +form.indRepasseIndividual,
        indInstalacao: +form.indInstalacao,
        indAtivo: +form.indAtivo,
        indRAcesso: +form.indRAcesso,
        indRHorario: +form.indRHorario,
        indSemat: +form.indSemat,
        indVerao: +form.indVerao,
        indPAE: +form.indPAE
      }
    };
    
    this._equipamentoContratoService.atualizar(obj).subscribe(() => {
      this._snack.exibirToast("Registro atualizado com sucesso!", "success");
      this._location.back();
    });
  }

  criar(): void {
    const form = this.form.getRawValue();

    let obj = {
      ...this.equipamento,
      ...form,
      ...{
        dataHoraCad: moment().format('YYYY-MM-DD HH:mm:ss'),
        codUsuarioCad: this.userSession.usuario.codUsuario,
        indReceita: +form.indReceita,
        indRepasse: +form.indRepasse,
        indRepasseIndividual: +form.indRepasseIndividual,
        indInstalacao: +form.indInstalacao,
        indAtivo: +form.indAtivo,
        indRAcesso: +form.indRAcesso,
        indRHorario: +form.indRHorario,
        indSemat: +form.indSemat,
        indVerao: +form.indVerao,
        indPAE: +form.indPAE
      }
    };

    this._equipamentoContratoService.criar(obj).subscribe(() => {
      this._snack.exibirToast("Registro inserido com sucesso!", "success");
      this._location.back();
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
