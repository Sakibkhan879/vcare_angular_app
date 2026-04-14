import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
declare var $;

@Injectable({
  providedIn: 'root'
})
export class UsersListService {
      constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  UsersList(param){
    var url = this.baseUrl + "api/User/LoadAllUsersList";
    return this.http.post<any>(url, param);
  }
}