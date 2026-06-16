import { Component, AfterViewInit } from '@angular/core';
import { from } from 'rxjs';
import { Router } from '@angular/router';
declare var $;
@Component
  ({
    selector: 'app-sidebar',
    templateUrl: '../../shared/sidebar/sidebar.component.html',
  })
export class SidebarComponent implements AfterViewInit {

  companycode: string = '';

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
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.companycode = userData?.companycode;
 



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

  }
  constructor(private _router: Router) {
    
  }


  /*Based on the sidebar selection we go to that particular page.
   * The sidebar will close on click for mobile view
   * */
 goToPage(a) {
  if (window.innerWidth < 600) {
    $('.page-container').toggleClass('sbar_collapsed');
  }

  switch (a) {
    case "login":
      this._router.navigate(['']);
      break;

    case "dashboard":
      this._router.navigate(['app/dashboard']);
      break;
    case "admission":
      this._router.navigate(['app/admission']);
      break;
    case "enquiry":
      this._router.navigate(['app/enquiry']);
      break;
    case "payment":
      this._router.navigate(['app/payment']);
      break;

    //case "log":
    //  if (this.companycode === 'C001') {
    //    console.log(this.companycode)
    //    this._router.navigate(['app/log']);
    //  }
    //  break;


    case "log":
      this._router.navigate(['app/log']);
      break;

    case "customer":
      this._router.navigate(['app/customer']);
      break;

    case "invoice":
      this._router.navigate(['app/invoice']);
      break;

    case "editinvoice":
      this._router.navigate(['app/invoice/edit']);
      break;
      case "assignment":
      this._router.navigate(['app/assignment']);
      break;
      case "processing":
      this._router.navigate(['app/processing']);
      break;
      case "qrscanner":
      this._router.navigate(['app/qrscanner']);
      break;
      case "table":
      this._router.navigate(['app/table'])
      break;
      case "forwardingnote":
      this._router.navigate(['app/forwardingnote'])
      break;
       case "staff":
      this._router.navigate(['app/staff'])
      break;
    default:
      console.log("Navigation case not found:", a);
      break;
  }
}
isAdmin() {
  let userdata: any = {};
  const storedUserdata = localStorage.getItem('userdata');
  if (storedUserdata) {
    userdata = JSON.parse(storedUserdata);  
    
  }
  return userdata && userdata.rolecode === 'ADMIN';
}
}
