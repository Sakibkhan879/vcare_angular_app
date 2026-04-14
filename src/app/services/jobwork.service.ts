import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class JobWorkService {
  userData: any = {};
  yearData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {
  }


  jobworkAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/JobWork/CreateNewJobWork";
    return this.http.post<any>(url, param);
  }


  jobworkListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = {  financialyearid: this.yearData };
    var url = this.baseUrl + "api/JobWork/LoadAllJobWorkDetailsList";
    return this.http.post<any>(url, obj);
  }

  jobworkLoadDetailsPromise(data) {
    this.getUserData();
    var obj = { jobworkmasterid: data,  logininfoid: this.userData.logininfoid };
    var url = this.baseUrl + "api/JobWork/LoadJobWorkDetailsById";
    return this.http.post<any>(url, obj);
  }

  jobworkUpdatePromise(obj) {
    var url = this.baseUrl + "api/JobWork/UpdateJobWorkById";
    return this.http.post<any>(url, obj);
  }

  jobworkDeletePromise(data) {
    var url = this.baseUrl + "api/JobWork/RemoveJobWorkMasterById";
    return this.http.post<any>(url, data);
  }

  checkJobWorkItemForDeletePromise(data) {
    var url = this.baseUrl + "api/JobWork/CheckJobWorkInChallan";
    return this.http.post<any>(url, data);
  }

  checkJobWorkMasterForDeletePromise(data) {
    var url = this.baseUrl + "api/JobWork/CheckJobWorkMasterInChallan";
    return this.http.post<any>(url, data);
  }
  customerJobWorkListPromise(data) {
    this.getUserData();
    var obj = { customerinfoid: data};
    var url = this.baseUrl + "api/JobWork/LoadJobWorkListByCustomerId";
    return this.http.post<any>(url, obj);
  }

  customerJobWorkDetailsPromise(data) {
    this.getUserData();
    var obj = { jobworkmasterid: data };
    var url = this.baseUrl + "api/JobWork/LoadJobWorkDetailsByCustomerId";
    return this.http.post<any>(url, obj);
  }
  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }
}
