import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FacadeService } from '../services/facade.service';

@Injectable({ providedIn: 'root' })
export class DocenteGuard implements CanActivate {

  constructor(
    private facade: FacadeService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const role = this.facade.getUserGroup();
    if (role === 'administrador' || role === 'maestro') return true;

    this.router.navigate(['/home']);
    return false;
  }
}
