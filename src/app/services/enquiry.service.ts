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
  companymasterid = 0;

  constructor(private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    @Inject('BASE_URL') private baseUrl: string) {
  }


  enquiryAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.academicyearid = this.yearData;
    param.companymasterid = this.companymasterid;
    var url = this.baseUrl + "api/Enquiry/CreateNewEnquiry";
    return this.http.post<any>(url, param);
  }


  enquiryListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companymasterid: this.companymasterid, academicyearid: this.yearData };
    var url = this.baseUrl + "api/Enquiry/LoadAllEnquiryList";
    return this.http.post<any>(url,obj);
  }

  enquiryLoadDetailsPromise(data) {
    this.getUserData();
    var url = this.baseUrl + "api/Enquiry/LoadEnquiryDetailsById";
    return this.http.post<any>(url, data);
  }

  enquiryUpdatePromise(obj) {
    var url = this.baseUrl + "api/Enquiry/UpdateEnquiryDetailsById";
    return this.http.post<any>(url,obj);
  }

  enquiryDeletePromise(data) {
    var url = this.baseUrl + "api/Enquiry/RemoveEnquiryDetailsById";
    return this.http.post<any>(url,data);
  }



  enquiryStatsPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companymasterid: this.companymasterid, academicyearid: this.yearData };
    var url = this.baseUrl + "api/Enquiry/LoadEnquiryMetrics";
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

  

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);

    }

    if (localStorage["companymasterid"]) {
      this.companymasterid = JSON.parse(localStorage["companymasterid"]);

    }


  }
}
