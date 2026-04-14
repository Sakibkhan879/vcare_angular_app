import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { UtilityService } from './utility.service';
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  userData: any = {};
  yearData: any = {};
  constructor(private http: HttpClient,
    private router: Router,
    private utilityService: UtilityService,
    @Inject('BASE_URL') private baseUrl: string) {
   
  }

  reportPromise(data) {
    this.getUserData();
    
    var _arr = [];
    var keys = Object.keys(data);

    console.log(keys);

    for (var x = 0; x < keys.length; x++) {
      _arr.push({ key: keys[x], value: data[keys[x]] });
    }

    var obj = { parameters: _arr, reportname: data.reportname };
   
    var url = this.baseUrl + "api/report/FetchStandardReport";
    return this.http.post<any>(url, obj);
  }
  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }
}

