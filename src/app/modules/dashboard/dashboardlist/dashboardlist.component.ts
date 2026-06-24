// import { AfterViewInit, ChangeDetectorRef, Component, Inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { DOCUMENT } from '@angular/common';
// import { NgxSmartModalService } from 'ngx-smart-modal';
// import { ToastrService } from 'ngx-toastr';
// import { EnquiryService } from '../../../services/enquiry.service';
// // import { EnquiryService } from '../../../services/enquiry.service'; // Uncomment this
// import * as XLSX from 'xlsx';

// declare var $: any;

// @Component({
//   selector: 'app-enquirylist',
//   templateUrl: './enquirylist.component.html',
//   styleUrls: ['./enquirylist.component.css'] // Add custom styles here if needed for the top boxes
// })
// export class EnquirylistComponent implements AfterViewInit {

//   excelHeaderList: any[] = [];
//   enquiryFileDetail: any = {};
//   columnMappingList: any[] = [];
//   importedenquiryList: any[] = [];
//   individualEnquiry: any = {};
//   currentEnquiry: any = {};
//   enquiryDetails: any[] = [];

//   constructor(
//     private _router: Router,
//     public ngxSmartModalService: NgxSmartModalService,
//     private enquiryService: EnquiryService, 
//     public cdr: ChangeDetectorRef,
//     private toastr: ToastrService,
//     @Inject(DOCUMENT) private _document: Document
//   ) {
//     // this.loadEnquiryListData();
//   }
//   enquiryStats: any = {
//   playgroup: 0,
//   nursery: 0,
//   euroJunior: 0,
//   euroSenior: 0,
//   total: 0
// };

//   refreshPage() {
//     this.loadEnquiryListData();
//   }

//   ngAfterViewInit() { 
//     this.loadEnquiryListData();
//   }

//   addEnquiryItem() {
//     this._router.navigate(['app/enquiry/add']);
//   }

//   editPage(val: any) {
//     this._router.navigate(['app/enquiry/edit'], {
//       queryParams: { enquiryinfoid: val.enquiryinfoid } // Assuming this is your primary key
//     });
//   }

//   loadEnquiryListData() {
//   if ($('.erp-datatable').length) {
//     if ($.fn.DataTable.isDataTable('.erp-datatable')) {
//       var t = $('.erp-datatable').DataTable();
//       t.destroy();
//     }
//   }

//   this.enquiryDetails = [];

//   var listProm = this.enquiryService.enquiryListPromise();
//   listProm.subscribe(result => {
//     if (result && result.status && result.data && result.data.length > 0) {
//       // 1. Load the table data
//       this.enquiryDetails = result.data;

//       // 2. Calculate the stats dynamically from the loaded database rows
//       // (Make sure 'programname' matches whatever column your backend actually sends)
//       this.enquiryStats.total = this.enquiryDetails.length;
//       this.enquiryStats.playgroup = this.enquiryDetails.filter(x => x.programname === 'PlayGroup').length;
//       this.enquiryStats.nursery = this.enquiryDetails.filter(x => x.programname === 'Nursery').length;
//       this.enquiryStats.euroJunior = this.enquiryDetails.filter(x => x.programname === 'Euro Junior').length;
//       this.enquiryStats.euroSenior = this.enquiryDetails.filter(x => x.programname === 'Euro Senior').length;

//       // NOTE: If your backend sends the counts directly in the API instead, 
//       // you could just do something like: this.enquiryStats = result.stats;

//       this.cdr.detectChanges();


//     } else {
//       // If database is empty, reset stats to 0
//       this.enquiryStats = { playgroup: 0, nursery: 0, euroJunior: 0, euroSenior: 0, total: 0 };
//       this.toastr.warning("No Enquiry Found");
//     }
//     if ($('.erp-datatable').length) {
//       $('.erp-datatable').DataTable({ "ordering": false });
//     }
//   });
// }

//   deleteData() {
//     // 3. USE ACTUAL DELETE API
//     var deleteProm = this.enquiryService.enquiryDeletePromise(this.currentEnquiry);
//     deleteProm.subscribe(result => {
//       if (result && result.status && result.data) {
//         this.toastr.success(result.message);
//         this.closeRecord();
//         this.refreshPage(); // Reloads the table after delete
//       } else {
//         this.toastr.error(result.message);
//       }
//     });
//   }
//   // Add this missing function back in!
//   closeRecord() {
//     this.ngxSmartModalService.getModal('deleteModalPopup').close();
//   }

//   // === IMPORT LOGIC CLONED FROM CUSTOMER ===
//   closeImportRecord() {
//     this.ngxSmartModalService.getModal('importEnquiryPopup').close();
//     this.enquiryFileDetail.enquiryfile = "";
//   }
//   // --- ADD THIS MISSING FUNCTION BACK ---
//   openDeleteModel(data: any) {
//     this.currentEnquiry = data; // Stores the specific row data so we know which one to delete
//     this.ngxSmartModalService.getModal('deleteModalPopup').open(); // Opens the confirmation popup
//   }
//   // Add the rest of your import parsing logic here (checkProductDetails, openImportModel, submitCustomerData renamed)
// }



import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { EnquiryService } from '../../../services/enquiry.service';
import { DashboardService } from '../../../services/dashboard.service';
import { AdmissionService } from '../../../services/admission.service';
import { PaymentService } from '../../../services/payment.service';
import { EventQueueService } from '../../../services/appevents.service';

import * as XLSX from 'xlsx';

declare var $: any;


@Component({
  selector: 'app-dashboardlist',
  templateUrl: './dashboardlist.component.html',
  styleUrls: ['./dashboardlist.component.css']
})


export class DashboardlistComponent implements OnInit {

  // Table and Data Variables
  admissionDetails: any[] = [];

  enquiryDetails: any[] = [];
  paymentdetails: any[] = [];




  // Dashboard Stats
  enquiryStats: any = [];
  admissionStats: any = [];

  totalrevenueStats: any = [];



  // Import/Excel Variables

  constructor(
    private _router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    private dashboardService: DashboardService,
    private admissionService: AdmissionService,
    private paymentService: PaymentService,
    private eventService: EventQueueService,
    public cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }



  loadDashboardData() {

    this.loadEnquiryStats();
    this.loadAdmissionStats();
    this.loadEnquiryListData();
    this.loadRevenueStats();

  }

  // ==========================================
  // LIFECYCLE & NAVIGATION
  // ==========================================
  ngOnInit() {

    this.loadDashboardData();
    this.eventService.loadMainDashboardData.subscribe(() => {
      console.log('Dashboard Refresh Triggered');
      this.loadDashboardData();
    });

  }

  loadEnquiryStats() {

    var statsProm = this.dashboardService.LoadAllEnquiryStatsPromise();

    statsProm.subscribe(result => {
      if (
        result &&
        result.status &&
        result.data &&
        result.data.length > 0
      ) {
        this.enquiryStats = result.data[0];
      }
    });

  }


  loadRevenueStats() {

    var statsProm = this.dashboardService.LoadTodayRevenuePromise();
    statsProm.subscribe(result => {
      if (
        result &&
        result.status &&
        result.data &&
        result.data.length > 0
      ) {
        this.totalrevenueStats = result.data[0];
      }
    });
  }

 


  loadAdmissionStats() {

    var statsProm = this.dashboardService.LoadAdmissionMetricsPromise();
    statsProm.subscribe(result => {
      if (
        result &&
        result.status &&
        result.data &&
        result.data.length > 0
      ) {
        this.admissionStats = result.data[0];
      }
    });

  }




  loadEnquiryListData() {
    if ($.fn.DataTable.isDataTable('#dataTable')) {
      $('#dataTable').DataTable().clear().destroy();
    }
    this.enquiryDetails = [];
    this.dashboardService.enquiryListPromise().subscribe(result => {
      if (result && result.status) {
        this.enquiryDetails = result.data || [];
        this.cdr.detectChanges();
        setTimeout(() => {
          $('#dataTable').DataTable({
            destroy: true,
            retrieve: true,
            ordering: false
          });

        }, 200);

      } else {
        this.enquiryDetails = [];
        this.toastr.warning('No Enquiry Found');

      }

    });

  }


  //loadEnquiryListData() {
  //  if ($('.erp-datatable').length) {
  //    if ($.fn.DataTable.isDataTable('.erp-datatable')) {
  //      var t = $('.erp-datatable').DataTable();
  //      t.destroy();
  //    }
  //  }

  //  this.enquiryDetails = [];

  //  var listProm = this.dashboardService.enquiryListPromise();
  //  listProm.subscribe(result => {
  //    if (result && result.status && result.data && result.data.length > 0) {

  //      // Load the table data
  //      this.enquiryDetails = result.data;


  //      this.cdr.detectChanges();

  //    } else {

  //      this.toastr.warning("No Enquiry Found");
  //    }

  //    if ($('.erp-datatable').length) {
  //      $('.erp-datatable').DataTable({ "ordering": false });
  //    }
  //  });


  //}




}
