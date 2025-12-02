import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacadeService } from './facade.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor(
    private http: HttpClient,
    private facadeService: FacadeService
  ) { }

  // Obtener estadísticas de usuarios
  public obtenerEstadisticasUsuarios(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }

    return this.http.get<any>(`${environment.url_api}/estadisticas-usuarios/`, { headers });
  }

  // Obtener estadísticas de materias
  public obtenerEstadisticasMaterias(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }

    return this.http.get<any>(`${environment.url_api}/estadisticas-materias/`, { headers });
  }

  // Obtener top profesores con más materias
  public obtenerTopProfesores(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }

    return this.http.get<any>(`${environment.url_api}/top-profesores/`, { headers });
  }

  // Obtener distribución de horarios
  public obtenerDistribucionHorarios(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }

    return this.http.get<any>(`${environment.url_api}/distribucion-horarios/`, { headers });
  }
}
