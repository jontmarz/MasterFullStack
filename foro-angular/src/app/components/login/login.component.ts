import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import {  faEye } from '@fortawesome/free-solid-svg-icons';
import {  faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public page_title: string;
  public user: User;
  public identity;
  public token;
  public status;
  public ojo = faEye;
  public ojoLine = faEyeSlash;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = 'Identifícate';
    this.user = new User('', '', '', '', '', '', 'Role_User');
  }

  ngOnInit(): void {
  }

  onSubmit(form) {
    // console.log(this.user);
    // Conseguir el objeto del usuario logueado
    this._userService.signup(this.user).subscribe(
      response => {
        if (response.user && response.user._id) {
          // Se guarda el usuario en una propiedad
          this.identity = response.user;
          localStorage.setItem('identity', JSON.stringify(this.identity));
          // conseguir el token
          this._userService.signup(this.user, true).subscribe(
            response => {
              if (response.token) {
                // console.log(response);
                // Guardar el token
                this.token = response.token;
                localStorage.setItem('token', this.token);
                // respuesta de la request
                this.status = 'success';
                this._router.navigate(['/inicio']); // Redirecionar a usuario despues del logueo
              } else {
                this.status = 'error';
              }
            }, error => {
              console.log(error);
            }
          );
        } else {
          this.status = 'error';
        }
      }, error => {
        console.log(error);
      }
    );
  }


}
