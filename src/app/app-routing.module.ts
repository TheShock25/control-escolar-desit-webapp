import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { AdminScreenComponent } from './screens/admin-screen/admin-screen.component';
import { AlumnosScreenComponent } from './screens/alumnos-screen/alumnos-screen.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { MaestrosScreenComponent } from './screens/maestros-screen/maestros-screen.component';
import { GraficasScreenComponent } from './screens/graficas-screen/graficas-screen.component';
import { RegistroMateriasComponent  } from './partials/registro-materias/registro-materias.component';
import { MateriasScreenComponent } from './screens/materias-screen/materias-screen.component';
import { AdminGuard } from './guards/admin.guard';
import { DocenteGuard } from './guards/docente.guard';


const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginScreenComponent },
      { path: 'registro-usuarios', component: RegistroUsuariosScreenComponent },
      { path: 'registro-usuarios/:rol/:id', component: RegistroUsuariosScreenComponent },
      {
  path: 'registro-materias',
  component: RegistroMateriasComponent,
  canActivate: [AdminGuard]
},
{
  path: 'registro-materias/:id',
  component: RegistroMateriasComponent,
  canActivate: [AdminGuard]
},

    ]
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'home', component: HomeScreenComponent },
      { path: 'administrador', component: AdminScreenComponent },
      { path: 'alumnos', component: AlumnosScreenComponent },
      { path: 'maestros', component: MaestrosScreenComponent },
      { path: 'graficas', component: GraficasScreenComponent },
      {
  path: 'materias',
  component: MateriasScreenComponent,
  canActivate: [DocenteGuard]
},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
