import { ClienteService } from './../../../../../core/services/cliente.service';
import { ContratoParameters } from './../../../../../core/types/contrato.types';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { ContratoService } from 'app/core/services/contrato.service';
import { ContratoData, Contrato } from 'app/core/types/contrato.types';
import { UserService } from 'app/core/user/user.service';
import { UserSession } from 'app/core/user/user.types';
import { interval, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { FileMime } from 'app/core/types/file.types';
import { FileService } from 'app/core/services/file.service';

@Component({
  selector: 'app-contrato-lista',
  templateUrl: './contrato-lista.component.html',
  styles: [`
        .list-grid-contrato {
            grid-template-columns: 48px 250px 150px auto 120px 30px;
            
            @screen sm {
                grid-template-columns: 48px 250px 150px auto 120px 30px;
            }
        
            @screen md{
                grid-template-columns: 48px 250px 150px auto 120px 30px;
            }
        
            @screen lg {
                grid-template-columns: 48px 250px 150px auto 120px 30px;
            }
        }
    `],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ContratoListaComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
    userSession: UserSession;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) private sort: MatSort;
    dataSourceData: ContratoData;
    selectedItem: Contrato | null = null;
    filtro: any;
    isLoading: boolean = false;
    protected _onDestroy = new Subject<void>();
    
  constructor(        
        private _cdr: ChangeDetectorRef,
        private _contratoService: ContratoService,
        private _userService: UserService,
        private _fileService: FileService
        ) { 

        this.userSession = JSON.parse(this._userService.userSession);
        }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
        this.carregarFiltro();

        interval(5 * 60 * 1000)
            .pipe(
                startWith(0),
                takeUntil(this._onDestroy)
            )
            .subscribe(() => {
                this.obterContratos();
            });

        /* this.registrarEmitters(); */

        if (this.sort && this.paginator) {
            this.sort.disableClear = true;
            this._cdr.markForCheck();

            this.sort.sortChange.subscribe(() => {
                this.paginator.pageIndex = 0;
                this.obterContratos();
            });
        }

        this._cdr.detectChanges();
    }

  private registrarEmitters(): void {
        // Quando o sidebar fecha
        this.sidenav.closedStart.subscribe(() => {
            this.paginator.pageIndex = 0;
            this.carregarFiltro();
            this.obterContratos();
        })
    }

  async obterContratos() {
        this.isLoading = true;

        const params: ContratoParameters = {
            pageNumber: this.paginator.pageIndex + 1,
            sortActive: this.sort.active || 'codContrato',
            sortDirection: this.sort.direction || 'desc',
            pageSize: this.paginator?.pageSize,
        };

        const data: ContratoData = await this._contratoService
            .obterPorParametros({
                ...params,
                ...this.filtro?.parametros
            })
            .toPromise();

        this.dataSourceData = data;
        console.log(data);
        this.isLoading = false;
    }

    carregarFiltro(): void {
        this.filtro = this._userService.obterFiltro('contrato');

        if (!this.filtro) {
            return;
        }

        // Filtro obrigatorio de filial quando o usuario esta vinculado a uma filial
        if (this.userSession?.usuario?.codFilial) {
            this.filtro.parametros.codFiliais = [this.userSession.usuario.codFilial]
        }

        Object.keys(this.filtro?.parametros).forEach((key) => {
            if (this.filtro.parametros[key] instanceof Array) {
                this.filtro.parametros[key] = this.filtro.parametros[key].join()
            };
        });
    }

    public async exportar()
    {
        this.isLoading = true;
        const params: ContratoParameters = {
            sortDirection: 'desc',
            pageSize: 100000,
        };

        window.open(await this._fileService.downloadLink("Contrato", FileMime.Excel, {
                ...this.filtro?.parametros,
                ...params
        })); 
        this.isLoading = false;  
    }

    paginar() {
        this.obterContratos();
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
}