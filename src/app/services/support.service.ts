import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
declare var $;

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  userData: any = {};
  yearData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  supportAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.financialyearid = this.yearData;
    param.companyid = this.userData.companyid;
    param.logininfoid= this.userData.logininfoid;
    var url = this.baseUrl + "api/support/CreateNewSupport";
    return this.http.post<any>(url, param);
  }

  supportListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/support/LoadSupportList";
    return this.http.post<any>(url, obj);
  }

  supportLoadDetailsPromise(data) {
    this.getUserData();
    var obj = { supportmasterid: data, companyid: this.userData.companyid };
    var url = this.baseUrl + "api/support/LoadSupportDataById";
    return this.http.post<any>(url, obj);
  }

    supportDeletePromise(data) {
      var url = this.baseUrl + "api/support/RemoveSupport";
      return this.http.post<any>(url, data);
    }
  

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }
}
