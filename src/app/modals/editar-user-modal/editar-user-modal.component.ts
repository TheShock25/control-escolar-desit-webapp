import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-user-modal',
  templateUrl: './editar-user-modal.component.html',
  styleUrls: ['./editar-user-modal.component.scss']
})
export class EditarUserModalComponent implements OnInit {

  public rol: string = "";

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<EditarUserModalComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.rol = this.data.rol;
  }

  public cerrar_modal(){
    this.dialogRef.close({isEdit:false});
  }

  public editarUser(){
    this.dialogRef.close({isEdit:true});

    if(this.rol == "administrador"){
      this.router.navigate(["registro-usuarios/administrador/" + this.data.id]);
    }else if(this.rol == "maestro"){
      this.router.navigate(["registro-usuarios/maestros/" + this.data.id]);
    }else if(this.rol == "alumno"){
      this.router.navigate(["registro-usuarios/alumnos/" + this.data.id]);
    }else if(this.rol == "materia"){
      this.router.navigate(["registro-materias/" + this.data.id]);
    }
  }

}
