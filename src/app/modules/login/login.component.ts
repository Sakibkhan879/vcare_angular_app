import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { UtilityService } from '../../services/utility.service';
declare var $;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements AfterViewInit, OnInit{
  public displayDiv: boolean = false;
  loginAddDetails: any = { username: "", password: "" };
  forgotPasswordModel: any = {};
  companyStateList: any[] = [];
  UserService: any;

  constructor(private _router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private utilityService: UtilityService,
    public ngxSmartModalService: NgxSmartModalService  ) { }

  async ngOnInit()
  {
    /* Its to check whether year details are present in local storage or not ,if year details are not present in local storage then it will
    give year details by filtering on financial year list*/
    if (!localStorage["yeardata"]) {
      var financialYearPromise = this.utilityService.LoadAcademicYearList('FINANCIAL_YEAR').toPromise();
      var financialYearList = await financialYearPromise;
      if (financialYearList && financialYearList.status && financialYearList.data.length > 0)
        localStorage["yeardata"] = financialYearList.data.filter(x => { if (x.iscurrentyear) return true; })[0].financialyearid;
    }
  }

  ngAfterViewInit() {
    /* Its to check subscription status and token, staff ,admin ids are present or not in local storage. If subscription status is active
     * and token, staff, admin ids are present then it will redirect to dashboard else it will redirect to subscription page so that user
     * can create subscription */
    if (localStorage["status"] == "active" && localStorage["stockmtoken"] && (localStorage["admininfoid"] > 0 || localStorage["staffinfoid"] > 0))
    {
      this._router.navigate(['app/dashboard']);
    }
    $('.form-gp input').on('focus', function () {
      $(this).parent('.form-gp').addClass('focused');
    });
    $('.form-gp input').on('focusout', function () {
      if ($(this).val().length === 0) {
        $(this).parent('.form-gp').removeClass('focused');
      }
    });
  }

  /* Using service and api call it will submit login details .After login it will give some details in response and store that details
   * into the local storage .
   * Based on role type which is stored in local storage it will give staff ,admin ids so that staff or admin
   * login accordingly.
   * If subscription status is active and token, staff, admin ids are present then it will redirect to dashboard else it will redirect
   * to subscription page so that user can create subscription*/
 loginAddData(loginForm: NgForm) {
  if (loginForm.valid) {
    this.userService.loginPromise(this.loginAddDetails).subscribe(result => {
      if (result && result.status && result.data) {
      
        this.toastr.success(result.message);
        this._router.navigate(['app/dashboard']);
        // Store common user data
        localStorage["userdata"] = JSON.stringify(result.data);
        localStorage["stockmtoken"] = result.data.token;
        localStorage["istemploginpassword"] = result.data.istemppassword;
        localStorage["status"] = result.data.status;
        localStorage["short_url"] = result.data.short_url;

        // Handle role-specific IDs
        if (result.data.rolecode === "ADMIN") {
          localStorage["admininfoid"] = result.data.admininfoid;
        } else if (result.data.rolecode === "STAFF") {
          localStorage["staffinfoid"] = result.data.staffinfoid;
        }

        // Load state settings and redirect
        this.loadStateWebSetting();
       
      } else {
        this.toastr.error(result.message || "Login failed");
      }
    });
  } else {
    this.toastr.error("Please enter all mandatory fields!");
  }
}

  // loginAddData(loginForm: NgForm){
  //   this._router.navigate(['invoice']);
  // }

  /* Its to redirect to signup page */
  signUpLink()
  {
    this._router.navigate(['register']);
  }

/* Its to open forget password modal popup */
  forgetPasswordLink()
  {
    this.loginAddDetails.username = "";
    this.ngxSmartModalService.getModal('forgetPasswordModal').open();
  }

/* Its to redirect to customerportal login page*/
  customerPortal()
  { 
    this._router.navigate(['customerportal']);
  }

/* Its to redirect to admin signin page */
  goToLoginPage() {
    this._router.navigate(['']);
  }

/* Using service by api call it will send the password on registered mobile number or according to validations, it will give error */
  sendPassword(forgetPwdForm: NgForm) {
    var prom = this.userService.adminExistForgetPasswordPromise(this.loginAddDetails.username)
    prom.subscribe(result => {
      if (result && result.status && result.data) {
        this.toastr.error("Password is successfully send to registered mobile number.");
      }
      else {
        this.toastr.error("");
      }
    }); 
  }


  loadStateWebSetting() {
    companyStateList: [] = [];
    
    var companyStateProm = this.utilityService.getWebSettingByDomainPromise('COMPANY_STATE');
    companyStateProm.subscribe(result => {
      this.companyStateList = result.data;

      console.log(this.companyStateList, ' this.companyStateList');
      var data = JSON.parse(localStorage["userdata"]);
      data.companystateid = result.data[0].keydata;
      localStorage["userdata"] = JSON.stringify(data);
    });

  }

/* Using service by api call it will check if user is exist or not, if user is exist then it will send the reset password link on the
 * registered email address or according to validations, it will give errors */
  verifyUser(forgetPwdForm: NgForm) {
    this.ngxSmartModalService.getModal('forgetPasswordModal').close(); 
    if (forgetPwdForm.valid) {
      var prom = this.userService.adminExistForgetPasswordPromise({ username: this.forgotPasswordModel.username });
      prom.subscribe(result => {
        if (result) {
          var resetprom = this.userService.resetAdminPassword({ username: this.forgotPasswordModel.username });
          resetprom.subscribe(result2 => {
            if (result2 && result2.status && result2.data) {
              this.forgotPasswordModel.username = "";
              this.toastr.success("An email with a new password has been sent to your registered email address.");
            }
            else {
              this.toastr.error("Error occured while sending email. Please try again later.");
            }
          });
        }
        else {
          this.toastr.error("Username not registered. Please sign up.");
        }
      });
    }
    else {
      this.toastr.error("Please enter proper username");
    }
  }
}
