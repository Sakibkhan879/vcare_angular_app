import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { Component, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../services/notification.service';
import { UtilityService } from '../../services/utility.service';
import { EventQueueService } from '../../services/appevents.service';
declare var $;

@Component({
  selector: 'app-navbar',
  templateUrl: '../../shared/navbar/navbar.component.html',
})
export class NavbarComponent implements AfterViewInit {
isCompanyInvalid: boolean = false;
  notificationDetails: any = {};
  changepasswordDetails: any = {};
  yearData: any = {};
  userData: any = {};
  yearDetails: number = 0;
  companymasterid: number = 0; 
  yearList: any[] = [];
  companyList: any[] = [];
  notificationList: any[] = [];

  ngAfterViewInit() {
  
    if (localStorage["istemploginpassword"] == "true") {
      this.openChangePasswordModel();
    }

    $(window).on('scroll', function () {
      var scroll = $(window).scrollTop(),
        mainHeader = $('#sticky-header'),
        mainHeaderHeight = mainHeader.innerHeight();

      // console.log(mainHeader.innerHeight());
      if (scroll > 1) {
        $("#sticky-header").addClass("sticky-menu");
      } else {
        $("#sticky-header").removeClass("sticky-menu");
      }
    });
    $('ul#nav_menu').slicknav({
      prependTo: "#mobile_menu"
    });

    if ($('#full-view').length) {
      var requestFullscreen = function (ele) {
        if (ele.requestFullscreen) {
          ele.requestFullscreen();
        } else if (ele.webkitRequestFullscreen) {
          ele.webkitRequestFullscreen();
        } else if (ele.mozRequestFullScreen) {
          ele.mozRequestFullScreen();
        } else if (ele.msRequestFullscreen) {
          ele.msRequestFullscreen();
        } else {
          console.log('Fullscreen API is not supported.');
        }
      };

      var fsDocButton = document.getElementById('full-view');
      var fsExitDocButton = document.getElementById('full-view-exit');

      fsDocButton.addEventListener('click', function (e) {
        e.preventDefault();
        requestFullscreen(document.documentElement);
        $('body').addClass('expanded');
      });

      fsExitDocButton.addEventListener('click', function (e) {
        e.preventDefault();
        $('body').removeClass('expanded');
      });
    }
  }

  refreshPage() {
    this.loadNotificationCount();
    this.loadAllNotification();
    this.financialyearSelectedValue();
     this.checkCompanySelection();
  }

  constructor(private _router: Router,
    private utilityService: UtilityService,
    private toastr: ToastrService,
    private notificationService: NotificationService,
    private eventService: EventQueueService,
    public ngxSmartModalService: NgxSmartModalService,
    @Inject(DOCUMENT) private _document: Document) {
    
    if (localStorage["yeardata"]) {
      this.yearDetails = +localStorage["yeardata"];
    } 
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }

    if (localStorage["companymasterid"]) {
      this.companymasterid = JSON.parse(localStorage["companymasterid"]);
    }
    
    this.loadYearWebSetting();
  }

  financialyearSelectedValue() {

    localStorage["yeardata"] = this.yearDetails;
    this.loadcustomerlist(this.yearDetails);
    console.log(this._router.url);
    if (this._router.url == "/app/dashboard") {
      this.eventService.loadMainDashboardData.emit({
        data: "Check for dashboard data"
      });
    }
    
    console.log(this.yearDetails);
  }


  SlotSelectedValue() {
    debugger
    localStorage["companymasterid"] = this.companymasterid;
    this.loadcustomerlist(this.yearDetails);
    console.log(this._router.url);
    this.eventService.loadMainDashboardData.emit();

    console.log(this.yearDetails);
  }

  companySelectedValue() {
  if (!this.companymasterid || this.companymasterid === 0) {
    this.isCompanyInvalid = true;
    return;
  }

  // Hide tooltip as soon as a company is selected
  this.isCompanyInvalid = false;


    var selectedobj = this.companyList.filter(x => {
      if (x.companymasterid == this.companymasterid)
        return true;
    })

    if (selectedobj.length > 0) {
      localStorage["companycode"]  =  selectedobj[0].companycode;
    }
  // Store and navigate
  localStorage["companymasterid"] = this.companymasterid;
  console.log("Selected Company ID:", this.companymasterid);

   if (this._router.url == "/app/dashboard") {
      
     this.eventService.loadMainDashboardData.emit({
       data: "Check for dashboard data"
     });
   }
  this._router.navigate(["/app/dashboard"]);
}


checkCompanySelection() {
  if (!this.companymasterid || this.companymasterid === 0) {
    this.isCompanyInvalid = true; // show tooltip

    
  } else {
    this.isCompanyInvalid = false; // hide tooltip
  }
  }

  
  loadYearWebSetting() {
    var yearProm = this.utilityService.LoadAcademicYearList({});
    yearProm.subscribe(result => {
      this.yearList = result.data;
      if (!localStorage["yeardata"]) {
        this.yearDetails = this.yearList[0].academicyearid;
        localStorage["yeardata"] = this.yearList[0].academicyearid;
      }
      // Load company list after year data is loaded
      this.loadcustomerlist(this.yearDetails);
    });
  }

  loadcustomerlist(financialyearid: number) {
    const body = { financialyearid }; 
    this.utilityService.LoadAllCompanyList(body).subscribe((res) => {
      if (res && res.data) {
        this.companyList = res.data;

        const exists = this.companyList.some(c => c.companymasterid === this.companymasterid);
        if (!exists) {
          this.companymasterid = 0;
          localStorage.removeItem("companymasterid");
        }

        // Only reset company selection if it's not already set in localStorage
        // or if the stored company is not in the new company list
        if (localStorage["companymasterid"]) {
          const storedCompanyId = JSON.parse(localStorage["companymasterid"]);
          const companyExists = this.companyList.some(company => company.companymasterid === storedCompanyId);
          
          if (companyExists) {
            // Keep the stored company selection
            this.companymasterid = storedCompanyId;
          } else {
            // Reset if stored company doesn't exist in new list
            this.companymasterid = 0;
            localStorage.removeItem("companymasterid");
          }
        } else {
          // No stored company, reset to default
          this.companymasterid = 0;
        }
      }
    });
  }

  loadNotificationCount() {
    var loadNotificationCountProm = this.notificationService.loadCountofNotificationPromise()
    loadNotificationCountProm.subscribe(result => {
      if (result && result.status && result.data) {
        this.notificationDetails.notificationtotalcount = result.data.Table[0].notificationtotalcount;
      } else {
        this.toastr.error(result.message);
      }
    })
  }

  loadAllNotification() {
    var loadNotificationProm = this.notificationService.loadAllNotificationListPromise()
    loadNotificationProm.subscribe(result => {
      if (result && result.status && result.data) {
        this.notificationList = result.data.Table;
      } else {
        this.toastr.error(result.message);
      }
    })
  }

  goToPage(a) {
    switch (a) {
      case "profile":
        this._router.navigate(['app/profile']);
        break;
      case "subscription":
        this._router.navigate(['app/subscription']);
        break;
      case "notification":
        this._router.navigate(['app/notification']);
        break;
      case "logout":
        localStorage.clear();
        this._router.navigate(['']);
        break;
      default:
        console.log("error");
        break;
    }
  }

  openChangePasswordModel() {
    this.ngxSmartModalService.getModal('changepwdModalPopup').open();
  }

  closeRecord() {
    this.ngxSmartModalService.getModal('changepwdModalPopup').close();
  }

  submitChangePassword(navbarForm: NgForm) {
    if (navbarForm.valid) {
      if (this.changepasswordDetails != "") {
        var addProm = this.notificationService.changepasswordAddPromise(this.changepasswordDetails)
        addProm.subscribe(result => {
          if (result && result.status && result.data) {
            console.log(result);
            this.toastr.success(result.message);
            navbarForm.reset();
            localStorage.clear();
            this._router.navigate(['']);
          } else {
            navbarForm.reset();
            this.toastr.error(result.message);
          }
        })
      } else {
        navbarForm.reset();
        this.toastr.error("Old Password & New Password both fields are mandatory!");
      }
    } else {
      this.toastr.error("Please Enter Old Password & New Password!");
    }
  }

  
}
