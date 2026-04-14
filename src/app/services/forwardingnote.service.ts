import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ForwardingNoteService {

  userData:any= {}

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string
  ) {}



LoadAssignment(param){
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
var url = this.baseUrl + "api/ForwardingNote/LoadAllCustomers"
return this.http.post<any>(url,param)
}

LoadInvoice(param){
  var url = this.baseUrl + "api/ForwardingNote/LoadAllInvoiceListByCustomer"
  return this.http.post<any>(url,param)
}

LoadTransporterList(param){
  var url = this.baseUrl + "api/ForwardingNote/LoadTransporterList"
  return this.http.post<any>(url,param);
}


CreateForwardingNote(body: any){
  this.getUserData()
  body.loginmasterid = this.userData.logininfoid
  var url = this.baseUrl + "api/ForwardingNote/CreateForwardingNote"
  return this.http.post<any>(url,body)
}


LoadAllForwardingList(param){
  var url = this.baseUrl + "api/ForwardingNote/LoadAllForwardingList"
  return this.http.post<any>(url,param)
}


LoadForwardingDetailsById(forwardingmasterid){
var url = this.baseUrl +  "api/ForwardingNote/LoadForwardingDetailsById"
return this.http.post<any>(url,forwardingmasterid)
}


UpdateForwardingNote(param){
  this.getUserData()
  param.loginmasterid = this.userData.logininfoid
  var url = this.baseUrl + "api/ForwardingNote/UpdateForwardingNote" 
  return this.http.post<any>(url,param)
}

LoadForwardingNoteCustomer(param)
{
  this.getUserData()
  param.loginmasterid = this.userData.logininfoid
  var url = this.baseUrl + "api/ForwardingNote/LoadForwardingNoteCustomerList"
}


getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }

FetchStandardReport(param){
  this.getUserData();
  param.loginmasterid = this.userData.logininfoid;
  var url = this.baseUrl + "api/Report/FetchStandardReport"
   return this.http.post<any>(url,param)
}

LoadForwardingNoteCustomerList(param){
  this.getUserData();
  param.loginmasterid = this.userData.logininfoid;
  var url = this.baseUrl + "api/ForwardingNote/LoadForwardingNoteCustomerList"
  return this.http.post<any>(url,param)
}


}