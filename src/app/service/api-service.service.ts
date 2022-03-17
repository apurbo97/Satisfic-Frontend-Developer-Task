import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  // baseURL = 'http://localhost:3004/';
  baseURL = 'https://json-server-apurbo.herokuapp.com/';
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

  public updateBulkLead(selection:any,data:object):Observable<any>{
    const arr = [];
    for(let item of selection){
      var res;
      res = this.httpClient.patch(this.baseURL+'data/'+item.id, data);
      arr.push(res)
    }
    return forkJoin(arr);
  }

}
