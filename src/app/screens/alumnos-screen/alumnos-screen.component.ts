import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MatDialog } from '@angular/material/dialog';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { EditarUserModalComponent } from 'src/app/modals/editar-user-modal/editar-user-modal.component';

@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})
export class AlumnosScreenComponent implements OnInit, AfterViewInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_alumnos: any[] = [];
  public userRole: string = "";

  // Columnas de la tabla
  displayedColumns: string[] = [
    'matricula', 'nombre', 'email', 'fecha_nacimiento',
    'curp', 'rfc', 'edad', 'telefono', 'ocupacion',
    'editar', 'eliminar'
  ];
  dataSource = new MatTableDataSource<DatosAlumno>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public facadeService: FacadeService,
    public alumnosService: AlumnosService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.userRole = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();

    if (this.token == "") {
      this.router.navigate(["/"]);
    }

    this.obtenerAlumnos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  isAdmin(): boolean {
    return this.userRole === 'administrador';
  }

  getDisplayedColumns(): string[] {
    const baseColumns = ['matricula', 'nombre', 'email', 'fecha_nacimiento', 'curp', 'rfc', 'edad', 'telefono', 'ocupacion'];

    if (this.isAdmin()) {
      return [...baseColumns, 'editar', 'eliminar'];
    }

    return baseColumns;
  }

  public obtenerAlumnos() {
    this.alumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        this.lista_alumnos = response;
        if (this.lista_alumnos.length > 0) {
          this.lista_alumnos.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
          //this.dataSource = new MatTableDataSource<DatosAlumno>(this.lista_alumnos as DatosAlumno[]);
          setTimeout(() => {
          this.dataSource.data = this.lista_alumnos;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
    },
    (error) => {
      console.error("Error al obtener la lista de alumnos: ", error);
      alert("No se pudo obtener la lista de alumnos");
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

  public goEditar(idUser: number) {
    if (!this.isAdmin()) {
      alert("No tienes permisos para editar alumnos");
      return;
    }

    const dialogRef = this.dialog.open(EditarUserModalComponent,{
      data: {id: idUser, rol: 'alumno'},
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isEdit){
        console.log("Redirigiendo a editar alumno");
        this.router.navigate(["registro-usuarios/alumnos/" + idUser]);
      } else {
        console.log("Edición cancelada");
      }
    });
  }

  public delete(idUser: number) {
    if (!this.isAdmin()) {
      alert("No tienes permisos para eliminar alumnos");
      return;
    }

    // Se obtiene el ID del usuario en sesión, es decir, quien intenta eliminar
    const userIdSession = Number(this.facadeService.getUserId());
    // Administrador puede eliminar cualquier alumno
    // Alumno solo puede eliminar su propio registro
    if (this.rol === 'administrador' || (this.rol === 'alumno' && userIdSession === idUser)) {
      //Si es administrador o es alumno, es decir, cumple la condición, se puede eliminar
      const dialogRef = this.dialog.open(EliminarUserModalComponent,{
        data: {id: idUser, rol: 'alumno'}, //Se pasan valores a través del componente
        height: '288px',
        width: '328px',
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Alumno eliminado");
        alert("Alumno eliminado correctamente.");
        //Recargar página
        window.location.reload();
      }else{
        alert("Alumno no se ha podido eliminar.");
        console.log("No se eliminó el alumno");
      }
    });
    }else{
      alert("No tienes permisos para eliminar este alumno.");
    }
  }
}

export interface DatosAlumno {
  id: number,
  matricula: string,
  first_name: string,
  last_name: string,
  email: string,
  fecha_nacimiento: string,
  curp: string,
  rfc: string,
  edad: number,
  telefono: string,
  ocupacion: string,
}
