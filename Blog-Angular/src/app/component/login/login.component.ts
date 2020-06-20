import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'ba-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ UserService ],
})
export class LoginComponent implements OnInit {
  public page_title: string;
  public user: User;
  public status: string;
  public token;
  public identity;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = 'Identifícate';
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', ''); // método user para datos de usuario
  }

  ngOnInit(): void {
    // Se mantiene ejecutado en la vida de la sesión y se cierra cuando recibe el parámetro "sure" por la url
    this.logout();
  }

  onSubmit(form) {
    // console.log(this.user); // imprime en consola los datos del formulario. los campos son de tipo User
    /* Se llama al método "signup" de "userService".
    Al ejecutar el método "subscribe", devuelve el token y el los datos de usuario como objeto */
    this._userService.signup(this.user).subscribe(
      response => {
        // TOKEN
        if (response.status !== 'error') {
          this.status = 'success';
          this.token = response;

          // OBJETO USUARIO IDENTIFICADO
          /* En este método, se valida el usuario identificado y se devuelve como un objeto.
          Se llama al método "signup" de "userService
          Usa parámetros con los datos del usuario como array con "this.user" y como objeto con "true".
          Estos datos se guardan en el localStorage para mantener disponible el token y habilitado la sesión del usuario*/
          this._userService.signup(this.user, true).subscribe(
            response => {
              this.identity = response;
              /* Mantener el usuario persistido
              Guardar el token y el objeto del usuario*/
              localStorage.setItem('token', this.token); // Guarda el token en el localStorage
              localStorage.setItem('identity', JSON.stringify(this.identity)); // Guarda el objeto del usuario como JSON en el LocalStorage

              // Redirección a inicio
              this.redirecturl();

            }, error => {
              this.status = 'error';
              console.log(error as any);
            }
          );
        } else {
          this.status = 'error';
        }
      }, error => {
        this.status = 'error';
        console.log(error as any);
      }
    );
  }

  // Método para el cierre de sesión
  logout() {
    this._route.params.subscribe(params => { // se llama al método _route, aplicandole params y el observable suscribe
      const logout = +params['sure']; // convertir el params a un dato númérico

      // con el condicional, se verifica el valor de la ruta logout
      if (logout === 1) {
        // si el resultado es true, se borra el identity y el token
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        // vaciar las propiedades existentes
        this.identity = null;
        this.token = null;

        // Redirección a inicio
        this.redirecturl();

      }
    });
  }
  redirecturl() {
    this._router.navigate(['inicio']);
  }
}
