import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentityGuard } from './services/identity.guard';

// Componentes
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { InicioComponent } from './component/inicio/inicio.component';
import { ErrorComponent } from './component/error/error.component';
import { UserEditComponent } from './component/user-edit/user-edit.component';
import { CategoryNewComponent } from './component/category-new/category-new.component';
import { PostNewComponent } from './component/post-new/post-new.component';
import { PostDetailComponent } from './component/post-detail/post-detail.component';
import { PostEditComponent } from './component/post-edit/post-edit.component';
import { CategoryDetailComponent } from './component/category-detail/category-detail.component';
import { ProfileComponent } from './component/profile/profile.component';

// Definición de Rutas
const appRoutes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'inicio', component: InicioComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout/:sure', component: LoginComponent},
  {path: 'registro', component: RegisterComponent},
  {path: 'ajustes', component: UserEditComponent, canActivate: [IdentityGuard]},
  {path: 'crear-categoria', component: CategoryNewComponent, canActivate: [IdentityGuard]},
  {path: 'crear-entrada', component: PostNewComponent, canActivate: [IdentityGuard]},
  {path: 'entrada/:id', component: PostDetailComponent},
  {path: 'editar-entrada/:id', component: PostEditComponent, canActivate: [IdentityGuard]},
  {path: 'categoria/:id', component: CategoryDetailComponent},
  {path: 'perfil/:id', component: ProfileComponent},
  {path: 'error', component: ErrorComponent},
  {path: '**', component: ErrorComponent}
];

// Exportar configuración
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
