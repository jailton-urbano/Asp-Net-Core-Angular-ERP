import { Component, Input, OnChanges, ViewChild } from "@angular/core";
import { IndicadorService } from "app/core/services/indicador.service";
import { IndicadorAgrupadorEnum, IndicadorParameters, IndicadorTipoEnum } from "app/core/types/indicador.types";
import { UsuarioSessao } from "app/core/types/usuario.types";
import { UserService } from "app/core/user/user.service";
import moment from "moment";
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};

@Component({
  selector: "app-grafico-reincidencia-filial",
  templateUrl: "./grafico-reincidencia-filial.component.html"
})
export class GraficoReincidenciaFilialComponent implements OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  @Input() filtro: any;
  usuarioSessao: UsuarioSessao;
  public chartOptions: Partial<ChartOptions>;
  isLoading: boolean;
  haveData: boolean;

  constructor(
    private _indicadorService: IndicadorService,
    private _userService: UserService
  ) {
    this.usuarioSessao = JSON.parse(this._userService.userSession);
  }

  ngOnChanges() {
    if (this.filtro) {
      this.carregarGrafico();
    }
  }

  public async carregarGrafico() {
    this.isLoading = true;

    const params: IndicadorParameters = {
      ...{
        agrupador: IndicadorAgrupadorEnum.FILIAL,
        tipo: IndicadorTipoEnum.REINCIDENCIA,
      },
      ...this.filtro?.parametros
    }

    let data = await this._indicadorService.obterPorParametros(params).toPromise();

    if (data?.length) {
      data = data.sort((a,b) => (a.valor > b.valor) ? 1 : ((b.valor > a.valor) ? -1 : 0));

      const labels = data.map(d => d.label);
      const valores = data.map(d => d.valor);
      const cores = data.map(d => d.valor >= 35 ? "#FF4560" : "#26a69a");
      this.haveData = true;
      this.inicializarGrafico(labels, valores, cores);
    } 

    this.isLoading = false;
  }

  private inicializarGrafico(labels: string[], valores: number[], cores: string[]) {
    this.chartOptions = {
      series: [
        {
          name: "Percentual",
          data: valores
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        events: {}
      },
      colors: cores,
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: true
      },
      xaxis: {
        categories: labels,
        labels: {
          style: {
            colors: cores,
            fontSize: "10px"
          }
        }
      },
      yaxis: {
        max: 100,
        labels: {
          formatter: (value) => {
            return (value + "%").replace('.', ',');
          }
        }
      }
    };
  }
}
