import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { routing, appRoutingProviders } from './app.routing';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import { AngularFileUploaderModule } from 'angular-file-uploader';

import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { InicioComponent } from './component/inicio/inicio.component';
import { ErrorComponent } from './component/error/error.component';
import { CategoryDetailComponent } from './component/category-detail/category-detail.component';
import { CategoryNewComponent } from './component/category-new/category-new.component';
import { PostDetailComponent } from './component/post-detail/post-detail.component';
import { PostEditComponent } from './component/post-edit/post-edit.component';
import { PostNewComponent } from './component/post-new/post-new.component';
import { UserEditComponent } from './component/user-edit/user-edit.component';

import { IdentityGuard } from './services/identity.guard';
import { UserService } from './services/user.service';
import { ProfileComponent } from './component/profile/profile.component';
import { PostListComponent } from './component/post-list/post-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    InicioComponent,
    ErrorComponent,
    CategoryDetailComponent,
    CategoryNewComponent,
    PostDetailComponent,
    PostEditComponent,
    PostNewComponent,
    UserEditComponent,
    ProfileComponent,
    PostListComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    routing,
    FormsModule,
    HttpClientModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    AngularFileUploaderModule,
  ],
  providers: [
    appRoutingProviders,
    IdentityGuard,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
