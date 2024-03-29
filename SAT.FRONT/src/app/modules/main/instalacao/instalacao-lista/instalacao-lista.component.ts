import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { ContratoService } from 'app/core/services/contrato.service';
import { CustomSnackbarService } from 'app/core/services/custom-snackbar.service';
import { FilialService } from 'app/core/services/filial.service';
import { InstalacaoLoteService } from 'app/core/services/instalacao-lote.service';
import { InstalacaoService } from 'app/core/services/instalacao.service';
import { TransportadoraService } from 'app/core/services/transportadora.service';
import { Contrato } from 'app/core/types/contrato.types';
import { Filial } from 'app/core/types/filial.types';
import { InstalacaoLote } from 'app/core/types/instalacao-lote.types';
import { Instalacao, InstalacaoParameters, InstalacaoData } from 'app/core/types/instalacao.types';
import { statusConst } from 'app/core/types/status-types';
import { Transportadora } from 'app/core/types/transportadora.types';
import { UserService } from 'app/core/user/user.service';
import { UserSession } from 'app/core/user/user.types';
import moment from 'moment';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-instalacao-lista',
  templateUrl: './instalacao-lista.component.html',
  styles: [
    /* language=SCSS */
    `
      .list-grid-instalacao {
          grid-template-columns: 72px auto 64px 240px 240px 72px;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InstalacaoListaComponent implements AfterViewInit {
  codContrato: number;
  contrato: Contrato;
  codInstalLote: number;
  instalacaoLote: InstalacaoLote;
  instalacaoSelecionada: Instalacao;
  transportadoras: Transportadora[] = [];
  filiais: Filial[] = [];
  @ViewChild('searchInputControl', { static: true }) searchInputControl: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;
  dataSourceData: InstalacaoData;
  isLoading: boolean = false;
  userSession: UserSession;
  form: FormGroup;
  transportadorasFiltro: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();

  constructor(
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _instalacaoSvc: InstalacaoService,
    private _transportadoraSvc: TransportadoraService,
    private _filialSvc: FilialService,
    private _contratoSvc: ContratoService,
    private _instalacaoLoteSvc: InstalacaoLoteService,
    private _snack: CustomSnackbarService,
    private _userSvc: UserService
  ) {
    this.userSession = JSON.parse(this._userSvc.userSession);
  }

  ngAfterViewInit(): void {
    this.codContrato = +this._route.snapshot.paramMap.get('codContrato');
    this.codInstalLote = +this._route.snapshot.paramMap.get('codInstalLote');

    this.obterInstalacoes();
    this.obterTransportadoras();
    this.obterFiliais();
    this.obterContrato();
    this.obterLote();

    if (this.sort && this.paginator) {
      this.sort.disableClear = true;
      this._cdr.markForCheck();

      this.sort.sortChange.subscribe(() => {
        this.paginator.pageIndex = 0;
        this.obterInstalacoes();
      });
    }

    this.form = this._formBuilder.group({
      codInstalacao: [''],
      codTransportadora: [''],
      nomeFilial: [{ value: '', disabled: true }],
      nomeLote: [{ value: '', disabled: true }],     
      dataRecLote: [{ value: '', disabled: true }],
      nroContrato: [{ value: '', disabled: true }],
      pedidoCompra: [''],
      superE: [''],
      csl: [''],
      csoServ: [''],
      supridora: [''],
      mst606TipoNovo: [''],
      nomeEquip: [{ value: '', disabled: true }],
      numSerie: [{ value: '', disabled: true }],
      numSerieCliente: [{ value: '', disabled: true }],
      prefixosb: [''],
      nomeLocal: [''],
      cnpj: [{ value: '', disabled: true }],
      endereco: [{ value: '', disabled: true }],
      nomeCidade: [{ value: '', disabled: true }],
      siglaUF: [{ value: '', disabled: true }],
      cep: [{ value: '', disabled: true }],
      dataLimiteEnt: [{ value: '', disabled: true }],
      dataSugEntrega: [''],
      dataConfEntrega: [''],
      nfRemessa: [{ value: '', disabled: true }],
      dataNFRemessa: [{ value: '', disabled: true }],
      dataExpedicao: [''],
      nomeTransportadora: [''],
      agenciaEnt: [''],
      nomeLocalEnt: [''],
      dtbCliente: [''],
      faturaTranspReEntrega: [''],
      dtReEntrega: [''],
      responsavelRecebReEntrega: [''],
      dataHoraChegTranspBT: [''],
      ressalvaEnt: [''],
      nomeRespBancoBT: [''],
      numMatriculaBT: [''],
      indBTOrigEnt: [{ value: '', disabled: true }],
      indBTOK: [{ value: '', disabled: true }],
      nfRemessaConferida: [''],
      dataLimiteIns: [''],
      dataSugInstalacao: [''],
      dataConfInstalacao: [''],
      os: [{ value: '', disabled: true }],
      dataHoraOS: [''],
      instalStatus: [{ value: '', disabled: true }],
      numRAT: [''],
      agenciaIns: [''],
      nomeLocalIns: [{ value: '', disabled: true }],
      dataBI: [''],
      qtdParaboldBI: [''],
      ressalvaIns: [''],
      indEquipRebaixadoBI: [''],
      ressalvaInsR: [{ value: '', disabled: true }]
    })

    fromEvent(this.searchInputControl.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(700)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.paginator.pageIndex = 0;
      this.searchInputControl.nativeElement.val = text;
      this.obterInstalacoes();
    });

    this.transportadorasFiltro.valueChanges
      .pipe(
        tap(() => {}),
        takeUntil(this._onDestroy),
        debounceTime(700),
        map(async query => {
          this.obterTransportadoras(query);
        }),
        delay(100),
        takeUntil(this._onDestroy)
      )
      .subscribe();

    this._cdr.detectChanges();
  }

  private async obterInstalacoes() {
    this.isLoading = true;

    const params: InstalacaoParameters = {
      codContrato: this.codContrato || undefined,
      codInstalLote: this.codInstalLote || undefined,
      pageSize: this.paginator?.pageSize,
      filter: this.searchInputControl.nativeElement.val,
      pageNumber: this.paginator.pageIndex + 1,
      sortActive: this.sort.active || 'CodInstalacao',
      sortDirection: this.sort.direction || 'desc',
    };

    const data: InstalacaoData = await this._instalacaoSvc
      .obterPorParametros(params)
      .toPromise();

    this.isLoading = false;
    this.dataSourceData = data;
  }

  private async obterTransportadoras(filter: string='') {
    const data = await this._transportadoraSvc.obterPorParametros({
      indAtivo: statusConst.ATIVO,
      sortActive: 'NomeTransportadora',
      sortDirection: 'asc',
      filter: filter
    }).toPromise();

    this.transportadoras = data.items;
  }

  private async obterFiliais(filter: string='') {
    const data = await this._filialSvc.obterPorParametros({
      indAtivo: statusConst.ATIVO,
      sortActive: 'NomeFilial',
      sortDirection: 'asc',
      filter: filter
    }).toPromise();

    this.filiais = data.items;
  }


  private async obterContrato() {
    this.contrato = await this._contratoSvc.obterPorCodigo(this.codContrato).toPromise();
  }

  private async obterLote() {
    this.instalacaoLote = await this._instalacaoLoteSvc.obterPorCodigo(this.codInstalLote).toPromise();
  }

  paginar() {
    this.obterInstalacoes();
  }

  alternarDetalhe(codInstalacao: number): void {
    if (this.instalacaoSelecionada && this.instalacaoSelecionada.codInstalacao === codInstalacao) {
      this.fecharDetalhe();
      return;
    }

    this.isLoading = true;

    this._instalacaoSvc.obterPorCodigo(codInstalacao)
      .subscribe((instalacao) => {
          this.instalacaoSelecionada = instalacao;
          this.form.patchValue(instalacao);
          this.form.controls['nomeFilial'].setValue(instalacao.filial?.nomeFilial);
          this.form.controls['nomeLote'].setValue(instalacao.instalacaoLote?.nomeLote);
          this.form.controls['dataRecLote'].setValue(moment(instalacao.instalacaoLote?.dataRecLote).format('DD/MM/yyyy'));
          this.form.controls['nroContrato'].setValue(instalacao.contrato?.nroContrato);
          this.form.controls['nomeEquip'].setValue(instalacao.equipamento?.nomeEquip);
          this.form.controls['numSerie'].setValue(instalacao.equipamentoContrato?.numSerie);
          this.form.controls['numSerieCliente'].setValue(instalacao.equipamentoContrato?.numSerieCliente);         

          if (instalacao.localAtendimentoSol) {
            this.form.controls['prefixosb'].setValue(`${instalacao.localAtendimentoSol?.numAgencia} / ${instalacao.localAtendimentoSol?.dcPosto}`);      
          }
          
          this.form.controls['nomeLocal'].setValue(instalacao.localAtendimentoSol?.nomeLocal); 
          this.form.controls['cnpj'].setValue(instalacao.localAtendimentoSol?.cnpj); 
          this.form.controls['endereco'].setValue(instalacao.localAtendimentoSol?.endereco); 
          this.form.controls['nomeCidade'].setValue(instalacao.localAtendimentoSol?.cidade?.nomeCidade); 
          this.form.controls['siglaUF'].setValue(instalacao.localAtendimentoSol?.cidade?.unidadeFederativa?.siglaUF); 
          this.form.controls['cep'].setValue(instalacao.localAtendimentoSol?.cep); 

          if (instalacao.equipamentoContrato.contrato.contratoEquipamento.codContratoEquipDataEnt > 0) {
            this.form.controls['dataLimiteEnt'].setValue(moment(instalacao.contrato?.dataAssinatura).format('DD/MM/yyyy'));            
          } 
          else {
            this.form.controls['dataLimiteEnt'].setValue(moment(instalacao.instalacaoLote.dataRecLote).format('DD/MM/yyyy'));  
          }
          
          if (instalacao.dataSugEntrega) {
            this.form.controls['dataSugEntrega'].setValue(moment(instalacao.dataSugEntrega).format('DD/MM/yyyy'));
          }

          if (instalacao.dataConfEntrega) {          
            this.form.controls['dataConfEntrega'].setValue(moment(instalacao.dataConfEntrega).format('DD/MM/yyyy'));
          }

          this.form.controls['nfRemessa'].setValue(instalacao.nfremessa); 
          this.form.controls['dataNFRemessa'].setValue(moment(instalacao.dataNfremessa).format('DD/MM/yyyy'));

          if(instalacao.dataExpedicao) {
            this.form.controls['dataExpedicao'].setValue(moment(instalacao.dataExpedicao).format('DD/MM/yyyy'));
          }

          this.form.controls['nomeTransportadora'].setValue(instalacao.transportadoras?.nomeTransportadora); 

          if (instalacao.localAtendimentoEnt) {
            this.form.controls['agenciaEnt'].setValue(`${instalacao.localAtendimentoEnt?.numAgencia} / ${instalacao.localAtendimentoEnt?.dcPosto}`);      
          }          

          this.form.controls['nomeLocalEnt'].setValue(instalacao.localAtendimentoEnt?.nomeLocal);
          this.form.controls['dtbCliente'].setValue(instalacao.dtbCliente); 
          this.form.controls['faturaTranspReEntrega'].setValue(instalacao.faturaTranspReEntrega);           

          if(instalacao.dtReEntrega) {
            this.form.controls['dtReEntrega'].setValue(moment(instalacao.dtReEntrega).format('DD/MM/yyyy'));
          }

          this.form.controls['responsavelRecebReEntrega'].setValue(instalacao.responsavelRecebReEntrega);   

          if(instalacao.dataHoraChegTranspBt) {
            this.form.controls['dataHoraChegTranspBT'].setValue(moment(instalacao.dataHoraChegTranspBt).format('DD/MM/yyyy'));
          }
          
          const instalRessalva = instalacao.instalacoesRessalva.sort((a, b) => a.codInstalRessalva - b.codInstalRessalva).shift();

          if (instalRessalva)
          {
            if (instalRessalva.codInstalMotivoRes === 0) {
              this.form.controls['ressalvaEnt'].setValue('SIM');
            } 
            else {
              this.form.controls['ressalvaEnt'].setValue('NÃO');
            }
  
            if (instalRessalva.codInstalMotivoRes === 1) {
              this.form.controls['ressalvaIns'].setValue('SIM');
            } 
            else {
              this.form.controls['ressalvaIns'].setValue('NÃO');
            }
            
            if (instalRessalva.codInstalMotivoRes === 2) {
              this.form.controls['indEquipRebaixadoBI'].setValue('SIM');
            } 
            else {
              this.form.controls['indEquipRebaixadoBI'].setValue('NÃO');
            }
  
            if (instalRessalva.codInstalMotivoRes === 2) {
              this.form.controls['ressalvaInsR'].setValue('SIM');
            } 
            else {
              this.form.controls['ressalvaInsR'].setValue('NÃO');
            }
          }
          
          this.form.controls['nomeRespBancoBT'].setValue(instalacao.nomeRespBancoBt);    
          this.form.controls['numMatriculaBT'].setValue(instalacao.numMatriculaBt);  
          
          if (instalacao.indBtorigEnt) {
            this.form.controls['indBTOrigEnt'].setValue('SIM');            
          } 
          else {
            this.form.controls['indBTOrigEnt'].setValue('NÃO');  
          }

          if (instalacao.indBtok) {
            this.form.controls['indBTOK'].setValue('SIM');            
          } 
          else {
            this.form.controls['indBTOK'].setValue('NÃO');  
          }       
          
          this.form.controls['nfRemessaConferida'].setValue(instalacao.nfRemessaConferida); 

          switch (instalacao.equipamentoContrato.contrato.contratoEquipamento.codContratoEquipDataIns)
          {
            case 0: 
              this.form.controls['dataLimiteIns'].setValue(moment(instalacao.contrato?.dataAssinatura).add(instalacao.equipamentoContrato.contrato.contratoEquipamento.qtdLimDiaIns, 'days').format('DD/MM/yyyy'));
            case 1: 
              this.form.controls['dataLimiteIns'].setValue(moment(instalacao.instalacaoLote?.dataRecLote).add(instalacao.equipamentoContrato.contrato.contratoEquipamento.qtdLimDiaIns, 'days').format('DD/MM/yyyy'));
            case 2: 
              this.form.controls['dataLimiteIns'].setValue(moment(instalacao.dataHoraChegTranspBt).add(instalacao.equipamentoContrato.contrato.contratoEquipamento.qtdLimDiaIns, 'days').format('DD/MM/yyyy'));
            default:
              this.form.controls['dataLimiteIns'].setValue(moment(instalacao.contrato?.dataAssinatura).add(instalacao.equipamentoContrato.contrato.contratoEquipamento.qtdLimDiaIns, 'days').format('DD/MM/yyyy'));
          }

          if (instalacao.dataSugInstalacao) {
            this.form.controls['dataSugInstalacao'].setValue(moment(instalacao.dataSugInstalacao).format('DD/MM/yyyy'));
          }
          
          if (instalacao.dataConfInstalacao) {
          this.form.controls['dataConfInstalacao'].setValue(moment(instalacao.dataConfInstalacao).format('DD/MM/yyyy'));
          }

          this.form.controls['os'].setValue(instalacao.codOS); //Abrir tela de chamados 

          if (instalacao.ordemServico) {
              this.form.controls['dataHoraOS'].setValue(moment(instalacao.ordemServico?.dataHoraSolicAtendimento).format('DD/MM/yyyy'));
          }
          
          this.form.controls['instalStatus'].setValue(instalacao.instalacaoStatus?.nomeInstalStatus); 
          
          this.form.controls['numRAT'].setValue(
            instalacao.ordemServico?.relatoriosAtendimento[instalacao.ordemServico?.relatoriosAtendimento.length - 1].numRAT
          );           
          
          if (instalacao.localAtendimentoIns) {
            this.form.controls['agenciaIns'].setValue(`${instalacao.localAtendimentoIns?.numAgencia} / ${instalacao.localAtendimentoIns?.dcPosto}`);      
          }    

          this.form.controls['nomeLocalIns'].setValue(instalacao.localAtendimentoIns?.nomeLocal);
          
          if (instalacao.dataBi) {
            this.form.controls['dataBI'].setValue(moment(instalacao.dataBi).format('DD/MM/yyyy'));
          }
        
          this.form.controls['qtdParaboldBI'].setValue(instalacao?.qtdParaboldBi);

                                    
          this.isLoading = false;
          this._cdr.markForCheck();
          
      }, () => {
        this.isLoading = false;
      });
  }


  fecharDetalhe(): void {
    this.instalacaoSelecionada = null;
  }

  atualizar() {
    const form: any = this.form.getRawValue();

    let obj = {
      ...this.instalacaoSelecionada,
      ...form,
      ...{
        dataHoraManut: moment().format('YYYY-MM-DD HH:mm:ss'),
        codUsuarioManut: this.userSession.usuario?.codUsuario
      }
    };

    Object.keys(obj).forEach((key) => {
      typeof obj[key] == "boolean" ? obj[key] = +obj[key] : obj[key] = obj[key];
    });

    this._instalacaoSvc.atualizar(obj).subscribe(() => {
      this._snack.exibirToast("Instalação atualizada com sucesso!", "success");
    });

    this.obterInstalacoes();
  }

  ngOnDestroy()
  {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
