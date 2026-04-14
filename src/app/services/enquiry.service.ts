import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
declare var $;

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  userData: any = {};
  yearData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    @Inject('BASE_URL') private baseUrl: string) {
  }


  enquiryAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/Enquiry/CreateNewEnquiry";
    return this.http.post<any>(url, param);
  }


  enquiryListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/Enquiry/LoadAllEnquiriesList";
    return this.http.post<any>(url,obj);
  }

  enquiryLoadDetailsPromise(data) {
    this.getUserData();
    var obj = { customerinfoid:data, companyid:this.userData.companyid};
    var url = this.baseUrl + "api/Enquiry/LoadEnquiryDetailsById";
    return this.http.post<any>(url, obj);
  }

  enquiryUpdatePromise(obj) {
    var url = this.baseUrl + "api/Enquiry/UpdateEnquiryDetailsById";
    return this.http.post<any>(url,obj);
  }

  enquiryDeletePromise(data) {
    var url = this.baseUrl + "api/Enquiry/RemoveEnquiryDetailsById";
    return this.http.post<any>(url,data);
  }

  enquiryListforBillPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid };
    var url = this.baseUrl + "api/Enquiry/LoadAllEnquiriesList";
    return this.http.post<any>(url, obj);
  }

  getEnquiryList(param) {
    var obj = { columndomain: param };
    var url = this.baseUrl + "api/product/MapColumnName";
    return this.http.post<any>(url, obj);

  }

  submitEnquiryPromise(data) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    data.financialyearid = this.yearData;
    data.companyid = this.userData.companyid;
    var url = this.baseUrl + "api/user/UploadEnquiryData";
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
