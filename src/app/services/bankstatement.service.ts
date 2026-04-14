import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BankStatementService {
  userData: any = {};
  yearData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {
  }


  bankstatementAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/BankStatement/CreateNewBankStatement";
    return this.http.post<any>(url, param);
  }


  bankstatementListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { financialyearid: this.yearData };
    var url = this.baseUrl + "api/BankStatement/LoadAllBankStatementList";
    return this.http.post<any>(url, obj);
  }

  bankstatementLoadDetailsPromise(data) {
    this.getUserData();
    var obj = { bankstatementmasterid :data ,logininfoid: this.userData.logininfoid };
    var url = this.baseUrl + "api/BankStatement/LoadBankStatementById";
    return this.http.post<any>(url, obj);
  }

  bankstatementUpdatePromise(obj) {
    var url = this.baseUrl + "api/BankStatement/UpdateBankStatementMasterById";
    return this.http.post<any>(url, obj);
  }

  bankstatementDeletePromise(data) {
    var url = this.baseUrl + "api/BankStatement/RemoveBankStatementById";
    return this.http.post<any>(url, data);
  }



  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }
}
