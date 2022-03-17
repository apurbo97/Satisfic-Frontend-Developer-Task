import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  baseURL = 'http://localhost:3004/';
  constructor(private httpClient:HttpClient) { }

  public getAllLeads():Observable<any>{
    return this.httpClient.get(this.baseURL+'data');
  }

  public getLeadById(id:string):Observable<any>{
    return this.httpClient.get(this.baseURL+'data/'+id);
  }

  public addLead(data:object):Observable<any>{
    return this.httpClient.post(this.baseURL+'data',data)
  }

  public deleteLead(id:string):Observable<any>{
    return this.httpClient.delete(this.baseURL+'data/'+id);
  }

  public updateLead(id:string,data:object):Observable<any>{
    return this.httpClient.put(this.baseURL+'data/'+id,data);
  }

}
