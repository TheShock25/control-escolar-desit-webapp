import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaMateria(){
    return {
      'nrc': '',
      'nombre': '',
      'seccion': '',
      'dias_json': [],
      'hora_inicio': '',
      'hora_final': '',
      'salon': '',
      'programa_educativo': '',
      'profesor_asignado': null,
      'creditos': ''
    }
  }

  public validarMateria(data: any, editar: boolean){
    console.log("Validando materia... ", data);
    let error: any = {};

    if(!this.validatorService.required(data["nrc"])){
      error["nrc"] = this.errorService.required;
    } else if(!this.validatorService.numeric(data["nrc"])){
      error["nrc"] = "Solo se permiten números";
    } else if(data["nrc"].length !== 5) {
      error["nrc"] = "El NRC debe tener 5 dígitos";
    }

    if(!this.validatorService.required(data["nombre"])){
      error["nombre"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["seccion"])){
      error["seccion"] = this.errorService.required;
    } else if(!this.validatorService.numeric(data["seccion"])){
      error["seccion"] = "Solo se permiten números";
    } else if(data["seccion"].length !== 3) {
      error["seccion"] = "La sección debe tener 3 dígitos";
    }

    if(!this.validatorService.required(data["dias_json"])){
      error["dias_json"] = "Debes seleccionar al menos un día";
    } else if(data["dias_json"].length === 0){
      error["dias_json"] = "Debes seleccionar al menos un día";
    }

    if(!this.validatorService.required(data["hora_inicio"])){
      error["hora_inicio"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["hora_final"])){
      error["hora_final"] = this.errorService.required;
    }

    // Validar que hora_inicio sea menor que hora_final
    if(data["hora_inicio"] && data["hora_final"]){
      if(data["hora_inicio"] >= data["hora_final"]){
        error["hora_final"] = "La hora final debe ser mayor a la hora de inicio";
      }
    }

    if(!this.validatorService.required(data["salon"])){
      error["salon"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["programa_educativo"])){
      error["programa_educativo"] = this.errorService.required;
    }

    // Profesor asignado puede ser null
    if(data["profesor_asignado"] === ""){
      data["profesor_asignado"] = null;
    }

    if(!this.validatorService.required(data["creditos"])){
      error["creditos"] = this.errorService.required;
    } else if(!this.validatorService.numeric(data["creditos"])){
      error["creditos"] = "Solo se permiten números";
    } else if(data["creditos"] < 1 || data["creditos"] > 12){
      error["creditos"] = "Los créditos deben estar entre 1 y 12";
    }

    return error;
  }

  //Servicios HTTP
  public registrarMateria (data: any): Observable <any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.post<any>(`${environment.url_api}/materias/`, data, { headers });
  }

  public obtenerListaMaterias(): Observable<any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/lista-materias/`, { headers });
  }

  public obtenerMateriaPorID(idMateria: number): Observable<any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/materias/?id=${idMateria}`, { headers });
  }

  public eliminarMateria(idMateria: number): Observable<any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.delete<any>(`${environment.url_api}/materias/?id=${idMateria}`, { headers });
  }

  public actualizarMateria(data: any): Observable<any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.put<any>(`${environment.url_api}/materias/`, data, { headers });
  }
}
