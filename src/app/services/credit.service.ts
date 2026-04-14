import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CreditService {
  userData: any = {};
  yearData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {


  }

  creditAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.companyid = this.userData.companyid;
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/credit/CreateNewCredit";
    return this.http.post<any>(url, param);
  }


  creditListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/credit/LoadCreditList";
    return this.http.post<any>(url, obj);
  }


  creditLoadDetailsPromise(data) {
    var obj = { creditmasterid: data };
    var url = this.baseUrl + "api/credit/LoadCreditDetailsById";
    return this.http.post<any>(url, obj);
  }


  creditUpdatePromise(obj) {
    var url = this.baseUrl + "api/credit/UpdateCreditDetails";
    return this.http.post<any>(url, obj);
  }


  creditDeletePromise(data) {
    var url = this.baseUrl + "api/credit/RemoveCredit";
    return this.http.post<any>(url, data);
  }

  confirmCreditPromise(data) {
    var url = this.baseUrl + "api/credit/CloseCreditById";
    return this.http.post<any>(url, data);
  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }
}
