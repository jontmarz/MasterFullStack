import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from '../services/global';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  public url: string;

  constructor(
    private _http: HttpClient
  ) {
    this.url = Global.url;
  }

  add(token, comment, topicId): Observable<any> {
    const params = JSON.stringify(comment);

    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);

    return this._http.post(this.url + 'comment/topic/' + topicId, params, {headers});
  }

  update(token, commentId, comment): Observable<any> {
    const params = JSON.stringify(comment);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);

    return this._http.put(this.url + 'topic/' + commentId, params, {headers});
  }

  delete(token, topicId, commentId): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);

    return this._http.delete(this.url + 'comment/' + topicId + '/' + commentId, {headers});
  }
}
