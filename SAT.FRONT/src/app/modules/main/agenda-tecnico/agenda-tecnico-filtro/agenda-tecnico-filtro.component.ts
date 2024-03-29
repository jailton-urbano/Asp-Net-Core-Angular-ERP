import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { FilterBase } from 'app/core/filters/filter-base';
import { FilialService } from 'app/core/services/filial.service';
import { TecnicoService } from 'app/core/services/tecnico.service';
import { Filial } from 'app/core/types/filial.types';
import { IFilterBase } from 'app/core/types/filtro.types';
import { Regiao } from 'app/core/types/regiao.types';
import { Tecnico } from 'app/core/types/tecnico.types';
import { UserService } from 'app/core/user/user.service';
import Enumerable from 'linq';
import moment from 'moment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-agenda-tecnico-filtro',
  templateUrl: './agenda-tecnico-filtro.component.html'
})
export class AgendaTecnicoFiltroComponent extends FilterBase implements OnInit, IFilterBase
{
  tecnicos: Tecnico[] = [];
  filiais: Filial[] = [];
  @Input() sidenav: MatSidenav;
  pas: number[] = [];
  regioes: Regiao[] = [];
  protected _onDestroy = new Subject<void>();

  constructor (
    private _tecnicoSvc: TecnicoService,
    private _filialSvc: FilialService,
    protected _userService: UserService,
    protected _formBuilder: FormBuilder,
  )
  {
    super(_userService, _formBuilder, 'agenda-tecnico');
  }

  createForm(): void
  {
    this.form = this._formBuilder.group({
      codTecnicos: [undefined],
      codFilial: [undefined],
      pas: [undefined],
      codRegioes: [undefined],
      codOS: [undefined]
    });

    const params = {
      ...this.filter?.parametros,
      ...{ codFilial: this.filter?.parametros?.codFilial || this.userSession.usuario?.codFilial }
    }

    this.form.patchValue(params);
  }

  async loadData(): Promise<void>
  {
    await this.obterFiliais();
    await this.obterTecnicosAoEscolherFilial();
    this.configurarFiltro();
  }

  ngOnInit(): void
  {
    this.createForm();
    this.loadData();
  }

  configurarFiltro()
  {
    if (this.form.controls['codFilial'].value && this.form.controls['codFilial'].value != "")
      this.obterTecnicos();
  }

  limpar()
  {
    super.limpar();

    if (this.userSession?.usuario?.codFilial)
    {
      this.form.controls['codFilial'].setValue(this.userSession.usuario.codFilial);
      this.form.controls['codFilial'].disable();
    }
  }

  private async obterTecnicosAoEscolherFilial()
  {
    this.form.controls['codFilial'].valueChanges.subscribe(() =>
    {
      this.form.controls['pas'].setValue(null);
      this.form.controls['codRegioes'].setValue(null);
      this.form.controls['codTecnicos'].setValue(null);

      this.obterTecnicos();
    });
  }

  private async obterTecnicos()
  {
    const data = await this._tecnicoSvc.obterPorParametros({
      indAtivo: 1,
      codFiliais: this.form.controls['codFilial'].value,
      pas: this.form.controls['pas'].value,
      codRegioes: this.form.controls['codRegioes'].value,
      codPerfil: 35,
      periodoMediaAtendInicio: moment().add(-7, 'days').format('yyyy-MM-DD 00:00'),
      periodoMediaAtendFim: moment().format('yyyy-MM-DD 23:59'),
      sortActive: 'nome',
      sortDirection: 'asc'
    }).toPromise();

    this.tecnicos = data.items;
    this.regioes = Enumerable.from(data.items).select(ra => ra.regiao).distinct(r => r.codRegiao).orderBy(r => r.nomeRegiao).toArray();
    this.pas = Enumerable.from(data.items).where(ra => ra.indPA != null && ra.indPA != 0).select(ra => ra.indPA).distinct(r => r).orderBy(r => r).toArray();
  }

  private async obterFiliais()
  {
    var codFilial = this.userSession.usuario?.filial?.codFilial || this.form.controls['codFilial'].value;

    if (codFilial)
    {
      this.form.controls['codFilial'].setValue(codFilial);
      await this.obterTecnicos();
    }

    if (this.userSession.usuario?.filial?.codFilial)
      this.form.controls['codFilial'].disable();

    const data = await this._filialSvc.obterPorParametros({
      indAtivo: 1,
      sortActive: 'nomeFilial',
      sortDirection: 'asc'
    }).toPromise();

    this.filiais = data.items;
  }

  ngOnDestroy()
  {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}