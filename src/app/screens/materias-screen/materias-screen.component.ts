import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { EditarUserModalComponent } from 'src/app/modals/editar-user-modal/editar-user-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit, AfterViewInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_materias: any[] = [];

  displayedColumns: string[] = [
    'nrc', 'nombre', 'seccion', 'dias', 'horario',
    'salon', 'programa_educativo', 'profesor', 'creditos',
    'editar', 'eliminar'
  ];
  dataSource = new MatTableDataSource<DatosMateria>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public facadeService: FacadeService,
    public materiasService: MateriasService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();
    if (this.rol === 'administrador') {
      this.displayedColumns = [
        'nrc', 'nombre', 'seccion', 'dias', 'horario',
        'salon', 'programa_educativo', 'profesor', 'creditos',
        'editar', 'eliminar'
      ];
    } else if (this.rol === 'maestro') {
      this.displayedColumns = [
        'nrc', 'nombre', 'seccion', 'dias', 'horario',
        'salon', 'programa_educativo', 'profesor', 'creditos'
      ];
    } else {
      this.displayedColumns = [
        'nrc', 'nombre', 'seccion', 'dias', 'horario',
        'salon', 'programa_educativo', 'profesor', 'creditos'
      ];
    }

    if(this.token == ""){
      this.router.navigate(["/"]);
    }
    this.obtenerMaterias();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public obtenerMaterias() {
    this.materiasService.obtenerListaMaterias().subscribe(
      (response) => {
        this.lista_materias = response;
        console.log("Lista de materias:", this.lista_materias);

        if (this.lista_materias.length > 0) {
          this.lista_materias.forEach(materia => {
            if (typeof materia.dias_json === 'string') {
              try {
                materia.dias_json = JSON.parse(materia.dias_json);
              } catch (e) {
                materia.dias_json = [];
              }
            }
            materia.horario_formateado = `${materia.hora_inicio} - ${materia.hora_final}`;
            materia.dias_formateados = Array.isArray(materia.dias_json) ?
              materia.dias_json.join(', ') : 'Sin días asignados';
            materia.nombre_profesor = materia.profesor_info ?
              materia.profesor_info.nombre : 'Sin asignar';
          });
           //this.dataSource = new MatTableDataSource<DatosAlumno>(this.lista_alumnos as DatosAlumno[]);
          setTimeout(() => {
            this.dataSource.data = this.lista_materias;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        }
      },
      (error) => {
        console.error("Error al obtener la lista de materias: ", error);
        alert("No se pudo obtener la lista de materias");
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public goEditar(idMateria: number) {
    const dialogRef = this.dialog.open(EditarUserModalComponent,{
      data: {id: idMateria, rol: 'materia'},
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isEdit){
        console.log("Redirigiendo a editar materia");
        this.router.navigate(["registro-materias/" + idMateria]);
      } else {
        console.log("Edición cancelada");
      }
    });
  }

  public delete(idMateria: number) {
    if (this.rol === 'administrador') {
      const dialogRef = this.dialog.open(EliminarUserModalComponent,{
        data: {id: idMateria, rol: 'materia'},
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result.isDelete){
          console.log("Materia eliminada");
          this.materiasService.eliminarMateria(idMateria).subscribe(
            (response) => {
              alert("Materia eliminada correctamente.");
              this.obtenerMaterias();
            },
            (error) => {
              alert("Error al eliminar la materia.");
              console.error("Error:", error);
            }
          );
        } else {
          alert("Materia no se ha podido eliminar.");
          console.log("No se eliminó la materia");
        }
      });
    } else {
      alert("No tienes permisos para eliminar materias.");
    }
  }

  public obtenerMateriaPorID(idMateria: number) {
    this.materiasService.obtenerMateriaPorID(idMateria).subscribe({
      next: (response) => {
        console.log("Materia obtenida por ID:", response);
        return response;
      },
      error: (error) => {
        console.error("Error al obtener materia por ID: ", error);
        alert("No se pudo cargar la materia");
      }
    });
  }
}

//Esto va fuera de la llave que cierra la clase
export interface DatosMateria {
  id: number;
  nrc: string;
  nombre: string;
  seccion: string;
  dias_json: string[] | string;
  dias_formateados: string;
  hora_inicio: string;
  hora_final: string;
  horario_formateado: string;
  salon: string;
  programa_educativo: string;
  profesor_asignado: number;
  nombre_profesor: string;
  creditos: number;
  creation: string;
  update: string;
}
