import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DebitService {
  userData: any = {};
  yearData: any = {};


  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {

  }


  debitAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.companyid = this.userData.companyid;
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/debit/CreateNewDebit";
    return this.http.post<any>(url, param);
  }


  debitListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/debit/LoadDebitList";
    return this.http.post<any>(url, obj);
  }


  debitLoadDetailsPromise(data) {
    var obj = { debitmasterid: data };
    var url = this.baseUrl + "api/debit/LoadDebitDetailsById";
    return this.http.post<any>(url, obj);
  }


  debitUpdatePromise(obj) {
    var url = this.baseUrl + "api/debit/UpdateDebitDetails";
    return this.http.post<any>(url, obj);
  }

  debitDeletePromise(data) {
    var url = this.baseUrl + "api/debit/RemoveDebit";
    return this.http.post<any>(url, data);
  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }
}
