import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
declare var $;

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  userData: any = {};
  yearData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    @Inject('BASE_URL') private baseUrl: string) {
  }


  customerAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/Customer/CreateNewCustomer";
    return this.http.post<any>(url, param);
  }


  customerListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/Customer/LoadAllCustomersList";
    return this.http.post<any>(url,obj);
  }

  customerLoadDetailsPromise(data) {
    this.getUserData();
    var obj = { customerinfoid:data, companyid:this.userData.companyid};
    var url = this.baseUrl + "api/Customer/LoadCustomerDetailsById";
    return this.http.post<any>(url, obj);
  }

  customerUpdatePromise(obj) {
    var url = this.baseUrl + "api/Customer/UpdateCustomerDetailsById";
    return this.http.post<any>(url,obj);
  }

  customerDeletePromise(data) {
    var url = this.baseUrl + "api/Customer/RemoveCustomerDetailsById";
    return this.http.post<any>(url,data);
  }

  customerListforBillPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid };
    var url = this.baseUrl + "api/Customer/LoadAllCustomersList";
    return this.http.post<any>(url, obj);
  }

  getCustomerList(param) {
    var obj = { columndomain: param };
    var url = this.baseUrl + "api/product/MapColumnName";
    return this.http.post<any>(url, obj);

  }

  submitCustomerPromise(data) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    data.financialyearid = this.yearData;
    data.companyid = this.userData.companyid;
    var url = this.baseUrl + "api/user/UploadCustomerData";
    return this.http.post<any>(url, data);
  }

  fetchRfmScore(data) {
    var urlfinal = this.baseUrl + "api/recommendation/FetchRfmScore";
    $.ajax({
      type: 'POST',
      url: urlfinal,
      data: data,
      headers: {
        Authorization: localStorage["stockmtoken"]
      }, success: (result) => {

        if (result && result.status && result.data && result.data.length > 0) {
          var rfmscore = result.data[0].rfmscore;
          var displaytext = "Based on bizman analysis, the customer score for " + data.customerinfo + " is " + rfmscore.toString() + " out of 9 ";
          this.toastr.success(displaytext);
        }

      },
      error: (result2) => {
      }
    })


  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }
}
