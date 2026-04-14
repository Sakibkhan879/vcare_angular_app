import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string
  ) {}

userData:any = {};

LoadAssignment(param){
          this.getUserData()
        param.loginmasterid = this.userData.logininfoid
    var url = this.baseUrl + "api/Assignment/LoadAllAssignmentList"
    return this.http.post<any>(url,param)
}

getLoginMasterId() {
  let userdata: any = {};
  let loginmaster = { "loginmasterid": 0 , "rolecode":'' };
  const storedUserdata = localStorage.getItem('userdata');
  if (storedUserdata) {
    userdata = JSON.parse(storedUserdata);
    loginmaster.loginmasterid = userdata.logininfoid;
    loginmaster.rolecode = userdata.rolecode;
  }
  return loginmaster;
}


SubmitDate(param){
         this.getUserData()
        param.loginmasterid = this.userData.logininfoid
var url = this.baseUrl + "api/Assignment/LoadCustomerListByDate"
return this.http.post<any>(url,param)
}

LoadInvoice(param){
          this.getUserData()
        param.loginmasterid = this.userData.logininfoid
  var url = this.baseUrl + "api/Assignment/LoadInvoiceListByCustomer"
  return this.http.post<any>(url,param)
}


CreateAssignment(body: any){
  this.getUserData()
  body.loginmasterid = this.userData.logininfoid
   var url = this.baseUrl + "api/Assignment/AssignInvoice"
  return this.http.post<any>(url,body)
}

UpdateAssignmentById(body:any){
   this.getUserData()
  body.loginmasterid = this.userData.logininfoid
  var url =this.baseUrl + "api/Assignment/UpdateAssignmentDetailsById"
  return this.http.post<any>(url,body)
}

GetAssignmentDetailsById(id: number) {
  const url = this.baseUrl + `api/Assignment/LoadAssignmentDetailsById`;
  return this.http.post<any>(url, { assignmentmasterid: id });
}

DeleteAssignmentById(id: number) {
  
  const url = this.baseUrl + `api/Assignment/RemoveAssignmentDetailsById`;
  return this.http.post<any>(url, { assignmentmasterid: id });
}

LoadTranportType(body:any){
  const url = this.baseUrl + "api/Assignment/LoadTranportType"
  return this.http.post<any>(url,body);
}

getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }


}