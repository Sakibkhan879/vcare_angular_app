import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
declare var $;

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {
  userData: any = {};
  yearData: any = {};
  companymasterid = 0;
  constructor(private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    @Inject('BASE_URL') private baseUrl: string) {
  }


  admissionAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.academicyearid = this.yearData;
    param.companymasterid = this.companymasterid;
    var url = this.baseUrl + "api/Admission/CreateNewStudent";
    return this.http.post<any>(url, param);
  }


  admissionListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companymasterid: this.companymasterid, academicyearid: this.yearData };
    var url = this.baseUrl + "api/Admission/LoadAllStudentList";
    return this.http.post<any>(url, obj);
  }

  admissionLoadDetailsPromise(data) {
    this.getUserData();
    var obj = { studentmasterid: data, companyid: this.userData.companyid };
    var url = this.baseUrl + "api/Admission/LoadStudentDetailsById";
    return this.http.post<any>(url, obj);
  }

   


  admissionUpdatePromise(obj) {
    var url = this.baseUrl + "api/Admission/UpdateStudentDetailsById";
    return this.http.post<any>(url, obj);
  }



  admissionDeletePromise(data) {
    var url = this.baseUrl + "api/admission/RemoveStudentDetailsById";
    return this.http.post<any>(url, data);
  }

  admissionListforBillPromise() {
    this.getUserData();
    var obj = { companyid: this.userData.companyid };
    var url = this.baseUrl + "api/Admission/LoadAllAdmissionList";
    return this.http.post<any>(url, obj);
  }

  getAdmissionList(param) {
    var obj = { columndomain: param };
    var url = this.baseUrl + "api/product/MapColumnName";
    return this.http.post<any>(url, obj);

  }

  submitAdmissionPromise(data) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    data.academicyearid = this.yearData;
    data.companyid = this.userData.companyid;
    var url = this.baseUrl + "api/user/UploadAdmissionData";
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
          var displaytext = "Based on bizman analysis, the admiission score for " + data.admissioninfo + " is " + rfmscore.toString() + " out of 9 ";
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
