import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private url= 'http://localhost:8081/api';
    constructor(private http: HttpClient) { }
    createPoint(point: any): Observable<any> {

      return this.http.post(this.url+`/point/add`,point);

  }
  createField(field: any): Observable<any> {

    return this.http.post(this.url+`/field/add`,field);

}
getAllFields():Observable<any>{
  return this.http.get(this.url+`/field/all`);

}
}
