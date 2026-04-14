import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StaffService {
  userData: any = {};
  yearData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {
  }


  staffAddPromise(param) {
    this.getUserData();
    var url = this.baseUrl + "api/User/CreateNewUser";
    return this.http.post<any>(url, param);
  }


  staffListPromise(param) {
    this.getUserData();
    var url = this.baseUrl + "api/User/LoadAllUsersList";
    return this.http.post<any>(url,param);
  }

  LoadPosition(param){
    this.getUserData();
    var url = this.baseUrl + "api/User/LoadPosition";
    return this.http.post<any>(url,param)
  } 
  LoadAllRoleList(param){
    this.getUserData();
    var url = this.baseUrl + "api/User/LoadAllRoleList";
    return this.http.post<any>(url,param)
  }
  staffLoadDetailsPromise(data) {
    var url = this.baseUrl + "api/User/LoadUserDetailsById";
    return this.http.post<any>(url, data);
  }

  staffUpdatePromise(obj) {
    var url = this.baseUrl + "api/User/UpdateUserDetailsById";
    return this.http.post<any>(url, obj);
  }

  staffDeletePromise(data) {
    var url = this.baseUrl + "api/user/RemoveStaff";
    return this.http.post<any>(url, data);
  }



  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }

}
