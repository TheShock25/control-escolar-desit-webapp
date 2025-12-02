import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { FacadeService } from 'src/app/services/facade.service';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { EditarUserModalComponent } from 'src/app/modals/editar-user-modal/editar-user-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {
  // Variables y métodos del componente
  public name_user: string = "";
  public lista_admins: any[] = [];

  constructor(
    public facadeService: FacadeService,
    private administradoresService: AdministradoresService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Lógica de inicialización aquí
    this.name_user = this.facadeService.getUserCompleteName();

    // Obtenemos los administradores
    this.obtenerAdmins();
  }

  //Obtener lista de usuarios
  public obtenerAdmins() {
    this.administradoresService.obtenerListaAdmins().subscribe(
      (response) => {
        this.lista_admins = response;
        console.log("Lista users: ", this.lista_admins);
      }, (error) => {
        alert("No se pudo obtener la lista de administradores");
      }
    );
  }

  public goEditar(idUser: number) {
    const dialogRef = this.dialog.open(EditarUserModalComponent,{
      data: {id: idUser, rol: 'administrador'},
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isEdit){
        console.log("Redirigiendo a editar administrador");
        this.router.navigate(["registro-usuarios/administrador/" + idUser]);
      } else {
        console.log("Edición cancelada");
      }
    });
  }

  public delete(idUser: number) {
  // Se obtiene el ID del usuario en sesión
  const userIdSession = Number(this.facadeService.getUserId());

  // Validar que no se esté eliminando a sí mismo
  if (idUser === userIdSession) {
    alert("No puedes eliminarte a ti mismo.");
    return;
  }

  // Administrador puede eliminar cualquier administrador
  if (this.facadeService.getUserGroup() === 'administrador') {
    const dialogRef = this.dialog.open(EliminarUserModalComponent,{
      data: {id: idUser, rol: 'administrador'},
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Administrador eliminado");
        alert("Administrador eliminado correctamente.");
        window.location.reload();
      }else{
        alert("Administrador no se ha podido eliminar.");
        console.log("No se eliminó el administrador");
      }
    });
  }else{
    alert("No tienes permisos para eliminar este administrador.");
  }
}
}
