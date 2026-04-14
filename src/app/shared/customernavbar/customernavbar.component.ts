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
@Component
  ({
    selector: 'app-customernavbar',
    templateUrl: '../../shared/customernavbar/customernavbar.component.html',
  })
export class CustomernavbarComponent implements AfterViewInit {

  notificationDetails: any = {};

  changepasswordDetails: any = {};

  yearData: any = {};

  yearDetails: number = 1;

  yearList: any[] = [];

  notificationList: any[] = [];
  ngAfterViewInit() {

    if (localStorage["istemppassword"] == "true")
    {
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

      //var exitFullscreen = function () {
      //  if (document.exitFullscreen) {
      //    document.exitFullscreen();
      //  } else if (document.webkitExitFullscreen) {
      //    document.webkitExitFullscreen();
      //  } else if (document.mozCancelFullScreen) {
      //    document.mozCancelFullScreen();
      //  } else if (document.msExitFullscreen) {
      //    document.msExitFullscreen();
      //  } else {
      //    console.log('Fullscreen API is not supported.');
      //  }
      //};

      var fsDocButton = document.getElementById('full-view');
      var fsExitDocButton = document.getElementById('full-view-exit');

      fsDocButton.addEventListener('click', function (e) {
        e.preventDefault();
        requestFullscreen(document.documentElement);
        $('body').addClass('expanded');
      });

      fsExitDocButton.addEventListener('click', function (e) {
        e.preventDefault();
        //exitFullscreen();
        $('body').removeClass('expanded');
      });
    }
  }
  refreshPage() {
    //this._document.defaultView.location.reload();
    this.loadYearWebSetting();
    this.loadNotificationCount();
    this.loadAllNotification();
  }

  constructor(private _router: Router,
    private utilityService: UtilityService,
    public ngxSmartModalService: NgxSmartModalService,
    private toastr: ToastrService,
    private eventService: EventQueueService,
    private notificationService: NotificationService,
    @Inject(DOCUMENT) private _document: Document) {
    if (localStorage["yeardata"]) {
      this.yearDetails = +localStorage["yeardata"];
    }

    this.loadYearWebSetting();
    //this.loadAllNotification();
    this.loadNotificationCount();
    this.loadAllNotification();
  }

  financialyearSelectedValue() {
    
    localStorage["yeardata"] = this.yearDetails;

    if (this._router.url == "/customerportal/dashboard") {
      this.eventService.loadCustomerDashboardSales.emit({
        data: "Check for sales order"
      });
    }

    this._router.navigate(['customerportal/dashboard']);
    console.log(this.yearDetails);
  }

  loadYearWebSetting() {
    yearList: [] = [];
    var yearProm = this.utilityService.LoadAllCompanyList('FINANCIAL_YEAR');
    yearProm.subscribe(result => {
      this.yearList = result.data;
      if (!localStorage["yeardata"]) {
        this.yearDetails = this.yearList[0].financialyearid;
        localStorage["yeardata"] = this.yearList[0].financialyearid;
      }

    });
  }



  loadNotificationCount() {
    var loadNotificationCountProm = this.notificationService.loadCustomerCountofNotificationPromise()
    loadNotificationCountProm.subscribe(result => {

      if (result && result.status && result.data) {

        //this.refreshPage();
        this.notificationDetails.notificationtotalcount = result.data.Table[0].notificationtotalcount;
      }
      else {
        this.toastr.error(result.message);
      }
    })
  }

  loadAllNotification() {
    var loadNotificationProm = this.notificationService.loadAllCustomerNotificationListPromise()
    loadNotificationProm.subscribe(result => {

      if (result && result.status && result.data) {

        //this.refreshPage();
        this.notificationList = result.data.Table;

      }
      else {
        this.toastr.error(result.message);
      }
    })
  }

  goToPage(a) {
    switch (a) {
      case "customerprofile":
        this._router.navigate(['customerportal/customerprofile']);
        break;
      case "customernotification":
        this._router.navigate(['customerportal/customernotification']);
        break;
      case "logout":
        localStorage.clear();
        this._router.navigate(['customerportal']);
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
            this._router.navigate(['customerportal']);
          }
          else {
            navbarForm.reset();
            this.toastr.error(result.message);
          }

        })
      }
    
    else {
      navbarForm.reset();
      this.toastr.error("Old Password & New Password both fields are mandatory!");

    }
  }
    else {
      this.toastr.error("Old Password & New Password both fields are mandatory!");
    }
  }
}


