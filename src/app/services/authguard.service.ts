import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilityService } from './utility.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private utilityService: UtilityService,
    private toastr: ToastrService,
  private _router: Router,) { }


  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean>  {
    if (localStorage["stockmtoken"]) {
      var prom = this.utilityService.checkPageRouteAccess(next.routeConfig.path).toPromise();
      var result = await prom;
      
          if(result && result.data){
            return true
          }
          else {
                  this.toastr.error("You don't have access to this page");
                 this._router.navigate(['app/dashboard']);
                return false;
          }
    }

      //else false
    else {
      return false;
    }
  }
}