import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  public url: string;

  constructor(
    private _http: HttpClient
  ) {
    this.url = Global.url;
  }

  create(token, category): Observable<any> {
    const json = JSON.stringify(category);
    const params = 'json=' + json;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.post(this.url + 'category', params, {headers});
  }

  getCategories(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'category', {headers});
  }

  getCategory(id): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'category/' + id, {headers});

  }

  getPosts(id): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'post/category/' + id, {headers});
  }
}
