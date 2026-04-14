import { query } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../services/customer.service';
import * as XLSX from 'xlsx';

declare var $;
@Component({
  selector: 'app-customerList',
  templateUrl: './customerlist.component.html'
})

export class CustomerlistComponent implements AfterViewInit {

  excelHeaderList: any[] = [];
  customerFileDetail: any = {};
  columnMappingList: any[] = [];

  importedcustomerList: any[] = [];
  individualCustomer: any = {};

  currentCustomer: any = {};

  customerDetails: any[] = [];

  mappingColumn: any[] = [];

  constructor(private _router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    private customerService: CustomerService,
    public cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private _document: Document) {
    this.loadCustomerListData();
  }

/* Its to call function which load customers list */
  refreshPage() {
    this.loadCustomerListData();
  }

  ngAfterViewInit() {

    

  }

/* Its to redirect to customer add page */
  addCustomerItem() {
    this._router.navigate(['app/customer/add']);
  }

/* Its to redirect to customer edit page by loading customerinfoid by query params */
  editPage(val) {
    this._router.navigate(['app/customer/edit'],
      {
        queryParams: { customerinfoid: val.customerinfoid }
      });
  }

  /* Its to load customer list details using service */

  loadCustomerListData() {
    if ($('.erp-datatable').length) {
      if ($.fn.DataTable.isDataTable('.erp-datatable')) {
        var t = $('.erp-datatable').DataTable();
        t.destroy();
      }
    }
    this.customerDetails = [];
    var listProm = this.customerService.customerListPromise()
    listProm.subscribe(result => {
      if (result && result.status && result.data && result.data.length > 0) {
        this.customerDetails = result.data;
        console.log(this.customerDetails, 'this.customerDetails');
        this.cdr.detectChanges();
      }
      else {
        this.toastr.warning("No Customer Found");
      }
      if ($('.erp-datatable').length) {
        $('.erp-datatable').DataTable({
          "ordering": false
        });
      }
    })

    

  }

/* Its to open delete modal popup */
  openDeleteModel(data) {
    this.currentCustomer = data;
    this.ngxSmartModalService.getModal('deleteModalPopup').open();
  }

/* Its to close delete modal popup */
  closeRecord() {
    this.ngxSmartModalService.getModal('deleteModalPopup').close();
  }

/* Its to delete each row data of table using service */
  deleteData() {
    var deleteProm = this.customerService.customerDeletePromise(this.currentCustomer)
    deleteProm.subscribe(result => {
     if (result && result.status && result.data) {
        this.toastr.success(result.message);
        this.closeRecord();
        this.refreshPage();
      }
      else {
        this.toastr.error(result.message);
      }
    })
  }


  closeImportRecord() {
    this.ngxSmartModalService.getModal('importCustomerPopup').close();
    this.customerFileDetail.customerfile = "";
  }

  checkProductDetails() {
    columnMappingList: [] = [];
    var productProm = this.customerService.getCustomerList('CUSTOMER');
    productProm.subscribe(result => {
      this.columnMappingList = result.data.Table;
      console.log(result.data.Table);
    });
  }

  
  openImportModel(ev) {
    this.customerFileDetail = {};
    this.ngxSmartModalService.getModal('importCustomerPopup').open();
    this.checkProductDetails();
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      this.importedcustomerList = jsonData.Sheet1;

      this.individualCustomer = this.importedcustomerList[0];

      Object.keys(this.individualCustomer);

      this.excelHeaderList = Object.keys(this.individualCustomer);
     
    }
    reader.readAsBinaryString(file);

  }
  

  submitCustomerData() {

    var actualdata = [];
    this.importedcustomerList.forEach(item => {
      var obj = {};
      this.columnMappingList.forEach(data => {
        obj[data.columnname] = (data.givenname) ? item[data.givenname] : null;
      });
      actualdata.push(obj);
    });

    var productProm = this.customerService.submitCustomerPromise({ filename: this.customerFileDetail.customerfile, customerdata: actualdata, categorytype: "CUSTOMERS" });
    productProm.subscribe(result => {
      if (result && result.status && result.data)
      {
        console.log(result.data);
        this.loadCustomerListData();
        this.toastr.success(result.message);
        this.customerFileDetail.customerfile = "";
      }
      else
      {
        this.toastr.error(result.message);
      }
    });

    this.closeImportRecord();

  }
}
