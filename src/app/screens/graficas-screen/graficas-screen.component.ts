import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { EstadisticasService } from 'src/app/services/estadisticas.service';
import { FacadeService } from 'src/app/services/facade.service';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {

  // Variables para datos dinámicos
  public estadisticasUsuarios: any = {};
  public estadisticasMaterias: any = {};
  public topProfesores: any[] = [];
  public distribucionHorarios: any = {};

  // Configuración común para todas las gráficas con tipos específicos
  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      datalabels: {
        color: '#000',
        font: {
          weight: 'bold'
        }
      }
    }
  };

  // Distribución de materias por programa educativo
  public lineChartData: any = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Materias por Horario',
        backgroundColor: '#F88406',
        borderColor: '#F88406',
        fill: false
      }
    ]
  };

  //Top profesores con más materias
  public barChartData: any = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Materias Asignadas',
        backgroundColor: [
          '#F88406', '#FCFF44', '#82D3FB', '#FB82F5', '#2AD84A'
        ]
      }
    ]
  };

  // Gráfica Circular - Distribución de usuarios
  public pieChartData: any = {
    labels: ['Administradores', 'Maestros', 'Alumnos'],
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Usuarios Registrados',
        backgroundColor: ['#FCFF44', '#F1C8F2', '#31E731']
      }
    ]
  };

  // Gráfica de Dona
  public doughnutChartData: any = {
    labels: ['Administradores', 'Maestros', 'Alumnos'],
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Usuarios Registrados',
        backgroundColor: ['#F88406', '#FCFF44', '#31E7E7']
      }
    ]
  };

  public lineChartPlugins = [DatalabelsPlugin];
  public barChartPlugins = [DatalabelsPlugin];
  public pieChartPlugins = [DatalabelsPlugin];
  public doughnutChartPlugins = [DatalabelsPlugin];

  constructor(
    private estadisticasService: EstadisticasService,
    private facadeService: FacadeService
  ) { }

  ngOnInit(): void {
    this.cargarDatosGraficas();
  }

  public cargarDatosGraficas() {
    this.obtenerEstadisticasUsuarios();
    this.obtenerEstadisticasMaterias();
    this.obtenerTopProfesores();
    this.obtenerDistribucionHorarios();
  }

  // Obtener estadísticas de usuarios
  public obtenerEstadisticasUsuarios() {
    this.estadisticasService.obtenerEstadisticasUsuarios().subscribe({
      next: (response) => {
        this.estadisticasUsuarios = response;
        this.actualizarGraficasUsuarios();
      },
      error: (error) => {
        console.error('Error al obtener estadísticas de usuarios:', error);
      }
    });
  }

  // Obtener estadísticas de materias
  public obtenerEstadisticasMaterias() {
    this.estadisticasService.obtenerEstadisticasMaterias().subscribe({
      next: (response) => {
        this.estadisticasMaterias = response;
        // Los datos de materias se usan en otras gráficas
      },
      error: (error) => {
        console.error('Error al obtener estadísticas de materias:', error);
      }
    });
  }

  // Obtener top profesores
  public obtenerTopProfesores() {
    this.estadisticasService.obtenerTopProfesores().subscribe({
      next: (response) => {
        this.topProfesores = response.top_profesores || [];
        this.actualizarGraficaBarras();
      },
      error: (error) => {
        console.error('Error al obtener top profesores:', error);
      }
    });
  }

  // Obtener distribución de horarios
  public obtenerDistribucionHorarios() {
    this.estadisticasService.obtenerDistribucionHorarios().subscribe({
      next: (response) => {
        this.distribucionHorarios = response.distribucion_horarios || {};
        this.actualizarGraficaLinea();
      },
      error: (error) => {
        console.error('Error al obtener distribución de horarios:', error);
      }
    });
  }

  // Actualizar gráficas de usuarios
  private actualizarGraficasUsuarios() {
    this.pieChartData.datasets[0].data = [
      this.estadisticasUsuarios.administradores || 0,
      this.estadisticasUsuarios.maestros || 0,
      this.estadisticasUsuarios.alumnos || 0
    ];

    this.doughnutChartData.datasets[0].data = [
      this.estadisticasUsuarios.administradores || 0,
      this.estadisticasUsuarios.maestros || 0,
      this.estadisticasUsuarios.alumnos || 0
    ];
  }

  // Actualizar gráfica de líneas (horarios)
  private actualizarGraficaLinea() {
    const labels = Object.keys(this.distribucionHorarios);
    const data = Object.values(this.distribucionHorarios);

    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          label: 'Materias por Horario',
          backgroundColor: '#F88406',
          borderColor: '#F88406',
          fill: false
        }
      ]
    };
  }

  // Actualizar gráfica de barras (top profesores)
  private actualizarGraficaBarras() {
    const labels = this.topProfesores.map(prof => prof.nombre);
    const data = this.topProfesores.map(prof => prof.total_materias);

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          label: 'Materias Asignadas',
          backgroundColor: [
            '#F88406', '#FCFF44', '#82D3FB', '#FB82F5', '#2AD84A'
          ]
        }
      ]
    };
  }

  // Método para forzar actualización
  public actualizarGraficas() {
    this.cargarDatosGraficas();
  }
}
