import { Component, AfterViewInit } from '@angular/core';
import { from } from 'rxjs';
import { Router } from '@angular/router';
declare var $;
@Component
  ({
    selector: 'app-customersidebar',
    templateUrl: '../../shared/customersidebar/customersidebar.component.html',
  })
export class CustomersidebarComponent implements AfterViewInit {


  ngAfterViewInit() {
    if (window.innerWidth <= 1364) {
      $('.page-container').addClass('sbar_collapsed');
    }
    $('.nav-btn').on('click', function () {
      $('.page-container').toggleClass('sbar_collapsed');
    });
    $("#menu").metisMenu();
    $('.menu-inner').slimScroll({
      height: 'auto'
    });
    $('.nofity-list').slimScroll({
      height: '435px'
    });
    $('.timeline-area').slimScroll({
      height: '500px'
    });
    $('.recent-activity').slimScroll({
      height: 'calc(100vh - 114px)'
    });
    $('.settings-list').slimScroll({
      height: 'calc(100vh - 158px)'
    });
  }
  constructor(private _router: Router) {

  }

  goToPage(a) {
    if (window.innerWidth < 600) {
      $('.page-container').toggleClass('sbar_collapsed');
    }
    switch (a) {
      case "customerportal":
        this._router.navigate(['customerportal']);
        break;
      case "dashboard":
        this._router.navigate(['customerportal/dashboard']);
        break;
      case "invoicehistory":
        this._router.navigate(['customerportal/invoicehistory']);
        break;
      case "paymenthistory":
        this._router.navigate(['customerportal/paymenthistory']);
        break;
      default:
        console.log("error");
        break;
    }
  }
}
