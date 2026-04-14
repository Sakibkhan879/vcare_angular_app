import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  userData:any = {};
  
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string
  ) {}



//   LoadTable(param){
//     var url = this.baseUrl + "api/Table/LoadAllTableList";
//     return this.http.post<any>(url, param);
//   }

LoadLabelByProcessId(param){
        this.getUserData()
        param.loginmasterid = this.userData.logininfoid
    var url = this.baseUrl + "api/Process/LoadLabelByProcessId";
    return this.http.post<any>(url,param);
}

ScanQR(param){
   this.getUserData()
        param.loginmasterid = this.userData.logininfoid
    var url = this.baseUrl + "api/Process/ScanQR";
    return this.http.post<any>(url,param)
}



getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }

}