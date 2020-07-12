import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from '../services/global';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  public url: string;


  constructor(
    private _http: HttpClient
  ) {
    this.url = Global.url;
  }

  test(){
    console.log('Esta es el servicio topic');
  }

  addTopic(token, topic): Observable<any> {
    const params = JSON.stringify(topic);

    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);

    return this._http.post(this.url + 'topic', params, {headers});
  }

  getMyTopicsByUser(userId): Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(this.url + 'user-topics/' + userId, {headers});
  }

  getTopic(id): Observable<any> {
    return this._http.get(this.url + 'topic/' + id);
  }

  update(token, id, topic): Observable<any> {
    const params = JSON.stringify(topic);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);

    return this._http.put(this.url + 'topic/' + id, params, {headers});
  }

  delete(token, id): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);

    return this._http.delete(this.url + 'topic/' + id, {headers});
  }

  getTopics(page = 1): Observable<any> {
    return this._http.get(this.url + 'topics/' + page);
  }

  getTopicById(id): Observable<any> {
    return this._http.get(this.url + 'topic/' + id);
  }

  search(searchString): Observable<any> {
    return this._http.get(this.url + 'search/' + searchString);
  }
}
