import { AfterViewInit, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from '../../../services/admission.service';
import * as XLSX from 'xlsx';

declare var $: any;

@Component({
  selector: 'app-admissionlist',
  templateUrl: './admissionlist.component.html',
  styleUrls: ['./admissionlist.component.css']
})
export class AdmissionlistComponent implements AfterViewInit {

  // Table and Data Variables
  admissionDetails: any[] = [];
  currentAdmission: any = {};

  // Dashboard Stats
  admissionStats: any = {
    playgroup: 0,
    nursery: 0,
    euroJunior: 0,
    euroSenior: 0,
    total: 0
  };

  // Import/Excel Variables
  excelHeaderList: any[] = [];
  admissionFileDetail: any = {};
  columnMappingList: any[] = [];
  importedadmissionList: any[] = [];
  individualAdmission: any = {};

  constructor(
    private _router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    private admissionService: AdmissionService,
    public cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private _document: Document
  ) { }

  // ==========================================
  // LIFECYCLE & NAVIGATION
  // ==========================================

  ngAfterViewInit() {
    this.loadAdmissionListData();
  }

  refreshPage() {
    this.loadAdmissionListData();
  }

  addAdmissionItem() {
    this._router.navigate(['app/admission/add']);
  }

  editPage(val: any) {
    this._router.navigate(['app/admission/edit'], {
      queryParams: { studentmasterid: val.studentmasterid }
    });
  }


  loadAdmissionListData() {
    if ($('.erp-datatable').length) {
      if ($.fn.DataTable.isDataTable('.erp-datatable')) {
        var t = $('.erp-datatable').DataTable();
        t.destroy();
      }
    }

    this.admissionDetails = [];

    var listProm = this.admissionService.admissionListPromise();
    listProm.subscribe(result => {
      if (result && result.status && result.data && result.data.length > 0) {

        // Load the table data
        this.admissionDetails = result.data;

        // Calculate the stats dynamically
        this.admissionStats.total = this.admissionDetails.length;
        this.admissionStats.playgroup = this.admissionDetails.filter(x => x.standardname === 'PlayGroup').length;
        this.admissionStats.nursery = this.admissionDetails.filter(x => x.standardname === 'Nursery').length;
        this.admissionStats.Junior = this.admissionDetails.filter(x => x.standardname === 'Junior').length;
        this.admissionStats.Senior = this.admissionDetails.filter(x => x.standardname === 'Senior').length;

        this.cdr.detectChanges();

      } else {
        // Reset stats if empty
        this.admissionStats = { playgroup: 0, nursery: 0, Junior: 0, Senior: 0, total: 0 };
        this.toastr.warning("No Admission Found");
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
    this.currentAdmission = data;
    this.ngxSmartModalService.getModal('deleteModalPopup').open();
  }

  closeRecord() {
    this.ngxSmartModalService.getModal('deleteModalPopup').close();
  }

  deleteData() {
    var deleteProm = this.admissionService.admissionDeletePromise(this.currentAdmission );
    deleteProm.subscribe(result => {
      if (result && result.status && result.data) {
        this.toastr.success("Deleted successfully");
        this.closeRecord();
        this.refreshPage();
      } else {
        this.toastr.error(result.message);
      }
    });
  }


  closeImportRecord() {
    this.ngxSmartModalService.getModal('importAdmissionPopup').close();
    this.admissionFileDetail.admissionfile = "";
  }

  checkAdmissionDetails() {
    this.columnMappingList = [];
  }

  openImportModel(ev: any) {
    this.admissionFileDetail = {};
    this.ngxSmartModalService.getModal('importEnquiryPopup').open();
    this.checkAdmissionDetails();

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

      this.importedadmissionList = jsonData.Sheet1;
      this.individualAdmission = this.importedadmissionList[0];
      this.excelHeaderList = Object.keys(this.individualAdmission);
    }
    reader.readAsBinaryString(file);
  }

  submitAdmissionData() {
    var actualdata: any[] = [];
    this.importedadmissionList.forEach(item => {
      var obj: any = {};
      this.columnMappingList.forEach(data => {
        obj[data.columnname] = (data.givenname) ? item[data.givenname] : null;
      });
      actualdata.push(obj);
    });
    this.closeImportRecord();
  }
}
