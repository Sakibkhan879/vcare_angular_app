import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  userData : any = {};
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string
  ) {}

CreateTabel(param){
  this.getUserData()
  param.loginmasterid = this.userData.logininfoid
     var url = this.baseUrl + "api/Table/CreateNewTable";
    return this.http.post<any>(url, param);
}

  LoadTable(param){
    var url = this.baseUrl + "api/Table/LoadAllTableList";
    return this.http.post<any>(url, param);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Upload failed:', error);
    return throwError(() =>
      new Error(error.error?.message || 'Server error during upload')
    );
  }


DeleteTable(tablemasterid: number) {
  const url = this.baseUrl + "api/Table/RemoveTableDetailsById";
  return this.http.post<any>(url, { tablemasterid });
}

UpdateTabel(param){
  const url =  this.baseUrl + "api/Table/UpdateTableDetailsById"
  return this.http.post<any>(url,param)
}


getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }

}