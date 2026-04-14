
import {  AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../services/notification.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { RegisterService } from '../../services/register.service';
import { UserService } from '../../services/user.service';
import { EventQueueService } from '../../services/appevents.service';
declare var $;
declare var AmCharts;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements AfterViewInit{
  public notificationFooter: boolean;
  public notificationCommentbox: boolean;

   date: Date = new Date();

  dashboardDetails: any = {};

  dashboardNotifications: any[] = [];


  ngAfterViewInit() {
    
    this.dashboardLoadDetails();
    this.loadSuggestion();

  }

  constructor(
    public cdr: ChangeDetectorRef,
    private registerService: RegisterService,
    private notificationService: NotificationService,
    public ngxSmartModalService: NgxSmartModalService,
    private eventService: EventQueueService,
    private userService: UserService,
    private toastr: ToastrService)
  {

    this.eventService.loadMainDashboardData.subscribe((data: any) => {
      this.dashboardLoadDetails();
    });

    this.dashboardLoadDetails();
  }

  dashboardLoadDetails() {

    var loadProm = this.registerService.dashboardLoadDetailsPromise(this.dashboardDetails)
    loadProm.subscribe(result => {
      if (result && result.status && result.data) {
        this.dashboardDetails = result.data[0];
        console.log(result.data);
        this.cdr.markForCheck();
  
      }
    })
  }

  openSalesModal() {
    this.ngxSmartModalService.getModal('salesModalPopup').open();
  }

  closeSalesRecord() {
    this.ngxSmartModalService.getModal('salesModalPopup').close();
  }

  openPurchasesModal() {
    this.ngxSmartModalService.getModal('purchasesModalPopup').open();
  }

  closePurchasesRecord() {
    this.ngxSmartModalService.getModal('purchasesModalPopup').close();
  }

  openPaymentModal() {
    this.ngxSmartModalService.getModal('paymentModalPopup').open();
  }

  closePaymentRecord() {
    this.ngxSmartModalService.getModal('paymentModalPopup').close();
  }

  openPaymentmadeModal() {
    this.ngxSmartModalService.getModal('paymentmadeModalPopup').open();
  }

  closePaymentmadeRecord() {
    this.ngxSmartModalService.getModal('paymentmadeModalPopup').close();
  }

  loadSuggestion() {
    this.dashboardNotifications = [];
    var loadProm = this.userService.loadSuggestionListPromise()
    loadProm.subscribe(result => {
      if (result && result.status && result.data && result.data.length > 0) {
        this.dashboardNotifications = result.data;
        this.cdr.markForCheck();

      }
      else {
        this.dashboardNotifications.push({ suggestiontext: "You do not have any suggestion or you have not subscribed to BizSuggestion. Only admin role can access BizSuggestion. Please contact Administrator for any queries." ,iconclass:"sg-red"});
      }
    })
  }

  markUseful(isuseful, data) {
    data.usefulresponse = isuseful;
    var loadJquery = this.userService.markSuggestionUsefulPromise(data)
    data.showuseful = false; 

  }

}

