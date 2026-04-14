import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  userData:any ={}
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string
  ) {}

getLoginMasterId() {
  let userdata: any = {};
  let loginmaster = { "loginmasterid": 0 , "rolecode":'' ,"logininfoid":0};
  const storedUserdata = localStorage.getItem('userdata');
  if (storedUserdata) {
    userdata = JSON.parse(storedUserdata);
    loginmaster.loginmasterid = userdata.logininfoid;
    loginmaster.rolecode = userdata.rolecode;
  }
  return loginmaster;
}




}