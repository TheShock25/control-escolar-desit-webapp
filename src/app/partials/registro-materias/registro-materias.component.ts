import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MateriasService } from 'src/app/services/materias.service';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent implements OnInit {

  @Input() datos_materia: any = {};

  public materia:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";
  public idMateria: number = 0;
  public listaProfesores: any[] = [];

  // Opciones para los selects
  public diasSemana: any[] = [
    {value: 'Lunes', nombre: 'Lunes'},
    {value: 'Martes', nombre: 'Martes'},
    {value: 'Miércoles', nombre: 'Miércoles'},
    {value: 'Jueves', nombre: 'Jueves'},
    {value: 'Viernes', nombre: 'Viernes'}
  ];

  public programasEducativos: any[] = [
    {value: 'ISC', viewValue: 'Ingeniería en Ciencias de la Computación'},
    {value: 'LCC', viewValue: 'Licenciatura en Ciencias de la Computación'},
    {value: 'ITI', viewValue: 'Ingeniería en Tecnologías de la Información'}
  ];

  constructor(
    private router: Router,
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private materiasService: MateriasService,
    private maestrosService: MaestrosService
  ) { }

  ngOnInit(): void {
    // Obtener lista de profesores
    this.obtenerProfesores();

    // El primer if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      this.idMateria = this.activatedRoute.snapshot.params['id'];
      console.log("ID Materia: ", this.idMateria);

      // Obtener la materia por ID
      this.obtenerMateriaPorID();
    } else {
      this.materia = this.materiasService.esquemaMateria();
      this.token = this.facadeService.getSessionToken();
    }
    console.log("Materia: ", this.materia);
  }

  public obtenerMateriaPorID() {
    this.materiasService.obtenerMateriaPorID(this.idMateria).subscribe({
      next: (response) => {
        this.materia = response;
        console.log("Materia obtenida: ", this.materia);
        if (typeof this.materia.dias_json === 'string') {
          try {
            this.materia.dias_json = JSON.parse(this.materia.dias_json);
          } catch (e) {
            this.materia.dias_json = [];
          }
        }

        if (this.materia.profesor_asignado && typeof this.materia.profesor_asignado === 'object') {
          this.materia.profesor_asignado = this.materia.profesor_asignado.id;
        }

        // Formatear horas para el datetimepicker (asegurar formato HH:mm)
        if (this.materia.hora_inicio) {
          this.materia.hora_inicio = this.formatTimeForPicker(this.materia.hora_inicio);
        }
        if (this.materia.hora_final) {
          this.materia.hora_final = this.formatTimeForPicker(this.materia.hora_final);
        }
      },
      error: (error) => {
        console.error("Error al obtener materia: ", error);
        alert("No se pudo cargar la materia");
      }
    });
  }

  public obtenerProfesores() {
    this.maestrosService.obtenerListaMaestros().subscribe({
      next: (response) => {
        this.listaProfesores = response;
        console.log("Profesores: ", this.listaProfesores);
      },
      error: (error) => {
        console.error("Error al obtener profesores: ", error);
        alert("Error al cargar la lista de profesores");
      }
    });
  }

  public regresar(){
    this.location.back();
  }

  public registrar() {
    // Validaciones del formulario
    this.errors = {};
    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    // Validar que la hora inicio sea menor que la hora final
    if (this.materia.hora_inicio && this.materia.hora_final) {
      const horaInicio = this.parseTimeString(this.materia.hora_inicio);
      const horaFinal = this.parseTimeString(this.materia.hora_final);

      if (horaInicio >= horaFinal) {
        alert('La hora de inicio debe ser menor que la hora de finalización');
        return false;
      }
    }

    // Registrar materia
    this.materiasService.registrarMateria(this.materia).subscribe({
      next: (response: any) => {
        alert('Materia registrada con éxito');
        console.log("Materia registrada", response);
        this.router.navigate(['materias']);
      },
      error: (error: any) => {
        if (error.status === 422) {
          this.errors = error.error.errors;
        } else if (error.status === 400 && error.error.message?.includes('NRC')) {
          alert('El NRC ya existe en la base de datos');
        } else {
          alert('Error al registrar la materia');
          console.error(error);
        }
      }
    });
  }

  public actualizar(){
    // Validación de los datos
    this.errors = {};
    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }

    // Validar que la hora inicio sea menor que la hora final
    if (this.materia.hora_inicio && this.materia.hora_final) {
      const horaInicio = this.parseTimeString(this.materia.hora_inicio);
      const horaFinal = this.parseTimeString(this.materia.hora_final);

      if (horaInicio >= horaFinal) {
        alert('La hora de inicio debe ser menor que la hora de finalización');
        return false;
      }
    }

    // Ejecutamos el servicio de actualización
    this.materiasService.actualizarMateria(this.materia).subscribe(
      (response) => {
        alert("Materia actualizada exitosamente");
        console.log("Materia actualizada: ", response);
        this.router.navigate(["materias"]);
      },
      (error) => {
        alert("Error al actualizar materia");
        console.error("Error al actualizar materia: ", error);
      }
    );
  }

  // Funciones auxiliares para el datetimepicker
  private formatTimeForPicker(timeString: string): string {
    // Convierte "HH:MM:SS" a "HH:MM" para el datetimepicker
    if (timeString && timeString.includes(':')) {
      return timeString.substring(0, 5);
    }
    return timeString;
  }

  private parseTimeString(timeString: string): number {
    // Convierte "HH:MM" a minutos desde medianoche para comparación
    if (timeString) {
      const [hours, minutes] = timeString.split(':').map(Number);
      return hours * 60 + minutes;
    }
    return 0;
  }

  public checkboxDiasChange(event:any){
    console.log("Evento: ", event);
    if(event.checked){
      this.materia.dias_json.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.materia.dias_json.forEach((dia: string, i: number) => {
        if(dia == event.source.value){
          this.materia.dias_json.splice(i,1)
        }
      });
    }
    console.log("Array días: ", this.materia.dias_json);
  }

  public revisarDiaSeleccionado(dia: string){
    if(this.materia.dias_json){
      var busqueda = this.materia.dias_json.find((element: string)=>element==dia);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32 &&
      charCode !== 209 &&
      charCode !== 241
    ) {
      event.preventDefault();
    }
  }

  public soloAlfanumerico(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 48 && charCode <= 57) &&
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }
}
