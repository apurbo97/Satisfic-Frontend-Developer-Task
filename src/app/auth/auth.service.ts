import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getAuthUser():boolean{
    return !!localStorage.getItem("user_details");
  }
}
