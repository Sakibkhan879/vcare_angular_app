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



import { AfterViewInit, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { EnquiryService } from '../../../services/enquiry.service';
import * as XLSX from 'xlsx';

declare var $: any;

@Component({
  selector: 'app-enquirylist',
  templateUrl: './enquirylist.component.html',
  styleUrls: ['./enquirylist.component.css']
})
export class EnquirylistComponent implements AfterViewInit {

  // Table and Data Variables
  enquiryDetails: any[] = [];
  currentEnquiry: any = {};
  
  // Dashboard Stats
  enquiryStats: any = {
    playgroup: 0,
    nursery: 0,
    euroJunior: 0,
    euroSenior: 0,
    total: 0
  };

  // Import/Excel Variables
  excelHeaderList: any[] = [];
  enquiryFileDetail: any = {};
  columnMappingList: any[] = [];
  importedenquiryList: any[] = [];
  individualEnquiry: any = {};

  constructor(
    private _router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    private enquiryService: EnquiryService, 
    public cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private _document: Document
  ) { }

  // ==========================================
  // LIFECYCLE & NAVIGATION
  // ==========================================

  ngAfterViewInit() { 
    this.loadEnquiryListData();
  }

  refreshPage() {
    this.loadEnquiryListData();
  }

  addEnquiryItem() {
    this._router.navigate(['app/enquiry/add']);
  }

  editPage(val: any) {
    this._router.navigate(['app/enquiry/edit'], {
      queryParams: { enquiryinfoid: val.enquiryinfoid } 
    });
  }

  // ==========================================
  // LOAD DATA & STATS
  // ==========================================

  // loadEnquiryListData() {
  //   if ($('.erp-datatable').length) {
  //     if ($.fn.DataTable.isDataTable('.erp-datatable')) {
  //       var t = $('.erp-datatable').DataTable();
  //       t.destroy();
  //     }
  //   }
    
  //   this.enquiryDetails = [];

  //   var listProm = this.enquiryService.enquiryListPromise();
  //   listProm.subscribe(result => {
      
  //     // ==========================================
  //     // TEMPORARY DUMMY DATA FOR UI TESTING
  //     // ==========================================
  //     this.enquiryDetails = [
  //       {
  //         enquiryinfoid: 1, // Required to open the Edit page
  //         studentname: 'Aarav Sharma (Dummy)',
  //         enquirername: 'Rahul Sharma',
  //         enquirercontact: '9876543210',
  //         stage: 'Interested',
  //         substage: 'New Enquiry',
  //         programname: 'PlayGroup' 
  //       }
  //     ];

  //     // Force the stats to update based on the dummy data
  //     this.enquiryStats.total = 1;
  //     this.enquiryStats.playgroup = 1;
  //     this.enquiryStats.nursery = 0;
  //     this.enquiryStats.euroJunior = 0;
  //     this.enquiryStats.euroSenior = 0;

  //     this.cdr.detectChanges();
      
  //     if ($('.erp-datatable').length) {
  //       $('.erp-datatable').DataTable({ "ordering": false });
  //     }
  //   });
  // }



  
  loadEnquiryListData() {
    if ($('.erp-datatable').length) {
      if ($.fn.DataTable.isDataTable('.erp-datatable')) {
        var t = $('.erp-datatable').DataTable();
        t.destroy();
      }
    }
    
    this.enquiryDetails = [];

    var listProm = this.enquiryService.enquiryListPromise();
    listProm.subscribe(result => {
      if (result && result.status && result.data && result.data.length > 0) {
        
        // Load the table data
        this.enquiryDetails = result.data;

        // Calculate the stats dynamically
        this.enquiryStats.total = this.enquiryDetails.length;
        this.enquiryStats.playgroup = this.enquiryDetails.filter(x => x.programname === 'PlayGroup').length;
        this.enquiryStats.nursery = this.enquiryDetails.filter(x => x.programname === 'Nursery').length;
        this.enquiryStats.euroJunior = this.enquiryDetails.filter(x => x.programname === 'Euro Junior').length;
        this.enquiryStats.euroSenior = this.enquiryDetails.filter(x => x.programname === 'Euro Senior').length;

        this.cdr.detectChanges();

      } else {
        // Reset stats if empty
        this.enquiryStats = { playgroup: 0, nursery: 0, euroJunior: 0, euroSenior: 0, total: 0 };
        this.toastr.warning("No Enquiry Found");
      }
      
      if ($('.erp-datatable').length) {
        $('.erp-datatable').DataTable({ "ordering": false });
      }
    });
  }

  // ==========================================
  // DELETE LOGIC
  // ==========================================

  openDeleteModel(data: any) {
    this.currentEnquiry = data; 
    this.ngxSmartModalService.getModal('deleteModalPopup').open(); 
  }

  closeRecord() {
    this.ngxSmartModalService.getModal('deleteModalPopup').close();
  }

  deleteData() {
    var deleteProm = this.enquiryService.enquiryDeletePromise(this.currentEnquiry);
    deleteProm.subscribe(result => {
      if (result && result.status && result.data) {
        this.toastr.success(result.message);
        this.closeRecord();
        this.refreshPage(); 
      } else {
        this.toastr.error(result.message);
      }
    });
  }

  // ==========================================
  // EXCEL IMPORT LOGIC 
  // ==========================================

  closeImportRecord() {
    this.ngxSmartModalService.getModal('importEnquiryPopup').close();
    this.enquiryFileDetail.enquiryfile = "";
  }

  checkEnquiryDetails() {
    this.columnMappingList = [];
    // Ensure getEnquiryList exists in your service if you plan to use the import feature
    /*
    var productProm = this.enquiryService.getEnquiryList('ENQUIRY');
    productProm.subscribe(result => {
      this.columnMappingList = result.data.Table;
    });
    */
  }

  openImportModel(ev: any) {
    this.enquiryFileDetail = {};
    this.ngxSmartModalService.getModal('importEnquiryPopup').open();
    this.checkEnquiryDetails();
    
    let workBook: any = null;
    let jsonData: any = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      this.importedenquiryList = jsonData.Sheet1;
      this.individualEnquiry = this.importedenquiryList[0];
      this.excelHeaderList = Object.keys(this.individualEnquiry);
    }
    reader.readAsBinaryString(file);
  }

  submitEnquiryData() {
    var actualdata: any[] = [];
    this.importedenquiryList.forEach(item => {
      var obj: any = {};
      this.columnMappingList.forEach(data => {
        obj[data.columnname] = (data.givenname) ? item[data.givenname] : null;
      });
      actualdata.push(obj);
    });

    // Ensure submitEnquiryPromise exists in your service if you plan to use the import feature
    /*
    var productProm = this.enquiryService.submitEnquiryPromise({ filename: this.enquiryFileDetail.enquiryfile, enquirydata: actualdata, categorytype: "ENQUIRY" });
    productProm.subscribe(result => {
      if (result && result.status && result.data) {
        this.loadEnquiryListData();
        this.toastr.success(result.message);
        this.enquiryFileDetail.enquiryfile = "";
      } else {
        this.toastr.error(result.message);
      }
    });
    */
    this.closeImportRecord();
  }
}