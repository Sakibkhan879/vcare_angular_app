import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
declare var $;

@Injectable({
  providedIn: 'root'
})
export class LogService {
  userData: any = {};
  yearData: any = {};
  companymasterid = 0;
  constructor(private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    @Inject('BASE_URL') private baseUrl: string) {
  }

   
  LoadStudentForLog(param) {
    this.getUserData();
    param.companyid = this.userData.companyid;
    this.yearData = localStorage["yeardata"];
    param.academicyearid = this.yearData;
    var url = this.baseUrl + "api/Log/LoadStudentForLog";
    return this.http.post<any>(url, param);
  }

  LogAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.companyid = this.userData.companyid;
    param.financialyearid = this.yearData;
    var url = this.baseUrl + "api/Log/CreateNewLog";
    return this.http.post<any>(url, param);
  }


 logListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companymasterid: this.companymasterid, academicyearid: this.yearData };
   var url = this.baseUrl + "api/Log/LoadAlllogList";
    return this.http.post<any>(url, obj);
 }

   

  RemoveLogListByIdPromise(data: any) {
    return this.http.post<any>(this.baseUrl + '/RemoveLogListById', data);
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
          var displaytext = "Based on bizman analysis, the admiission score for " + data.Dashboardinfo + " is " + rfmscore.toString() + " out of 9 ";
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

    if (localStorage["companymasterid"]) {
      this.companymasterid = JSON.parse(localStorage["companymasterid"]);

    }
  }
}
