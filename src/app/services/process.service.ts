import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

userData:any = {}
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string
  ) {}



 CreateNewProcess(param) {
        this.getUserData()
        param.loginmasterid = this.userData.logininfoid
        var url = this.baseUrl + "api/Process/CreateNewProcess"
        return this.http.post<any>(url, param)
    }
    

    LoadProductsById(param) {
        this.getUserData()
        param.loginmasterid = this.userData.logininfoid
        var url = this.baseUrl + "api/Process/LoadProductsById"
        return this.http.post<any>(url, param)
    }

    SearchProductById(param){
        this.getUserData()
        param.loginmasterid = this.userData.logininfoid
        var url = this.baseUrl + "api/Process/SearchProductById"
        return this.http.post<any>(url,param)
    }

    LoadAllProcessList(param){
      this.getUserData()
      param.loginmasterid = this.userData.logininfoid
      var url = this.baseUrl + "api/Process/LoadAllProcessList"
      return this.http.post<any>(url,param)
    }

    LoadProcessDetailsById(param){
      this.getUserData()
      param.loginmasterid = this.userData.logininfoid
      var url = this.baseUrl + "api/Process/LoadProcessDetailsById"
      return this.http.post<any>(url,param)
    }

    loadproductstatusbyid(param){
      this.getUserData();
      param.loginmasterid = this.userData.logininfoid;
      var url = this.baseUrl + "api/Process/ItemPendingList"
      return this.http.post<any>(url,param)
    }

    UpdateProcessDetailsById(param){
      this.getUserData()
      param.loginmasterid = this.userData.logininfoid
      var url = this.baseUrl + "api/Process/UpdateProcessDetailsById"
      return this.http.post<any>(url,param)
    }

    StartProcessing(param){
      var url = this.baseUrl + "api/Assignment/StartProcessing"
      return this.http.post<any>(url,param)
    }




    getUserData() {
      
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }

}