import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url: string;
  public identity;
  public token;

  constructor(
    public _http: HttpClient
  ) {
    this.url = Global.url;
  }

  test() {
    return 'Hola soy un Servicio!!';
  }

  // servicio que realiza el registro del usuario con los datos del formulario
  register(user): Observable<any> {
    const json = JSON.stringify(user); // convierte los datos en de un string a un JSON String
    const params = 'json=' + json; // params crea el tipo de datos que van en la cabecera
    // Crea el tipo de cabecera que tendrá el servicio
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    /* devuelve la cabecera que irá en la petición hacia el servidor.
    la concatenación de la cabecera será: url del servidor, método registro, tipo de datos y tipo de cabecera */
    return this._http.post(this.url + 'register', params, {headers});
  }

  // Servicio que realiza el login del usuario
  signup(user, getToken = null): Observable<any> {
    /* El método signup toma los datos del formulario y los convierte en un token JSON */
    if (getToken != null) {
      user.getToken = 'true';
    }

    const json = JSON.stringify(user);  // convierte los datos en de un string a un JSON String
    const params = 'json=' + json; // params crea el tipo de datos que van en la cabecera
    // Crea el tipo de cabecera que tendrá el servicio
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    /* devuelve la cabecera que irá en la petición hacia el servidor.
    la concatenación de la cabecera será: url del servidor, método registro, tipo de datos y tipo de cabecera */
    return this._http.post(this.url + 'login', params, {headers});
  }

  update(token, user): Observable<any> {
    // Limpia campo content (editor texto enriquecido) htmlentities > utf8
    user.content = Global.htmlEntities(user.content);
    const json = JSON.stringify(user);
    const params = 'json=' + json;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                     .set('Authorization', token);

    return this._http.put(this.url + 'user/update', params, {headers});
  }

  // Obtenemos los post creados por el usuario
  getPost(id): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.get(this.url + 'post/user/' + id, {headers});
  }

  // Obtenemos el detalle de los post creados por el usuario
  getUser(id): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.get(this.url + 'user/detail/' + id, {headers});
  }

  // Servicio que extrae la identificación del usuario almacenado en el localStorage
  getIdentity() {
    const identity = JSON.parse(localStorage.getItem('identity')); // convierte datos JSON a string

    // Cuando identity es true, diferente de 'undefined' devuelve true
    if (identity && identity !== 'undefined' ) {
      this.identity = identity;
    } else {
      this.identity = null;
    }

    return this.identity;
  }

  // Servicio que extrae la validación del token almacenado en el localStorage
  getToken() {
    const token = localStorage.getItem('token');

    // Cuando el token es true, diferente de 'undefined' devuelve true
    if (token && token !== 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;
  }
}
