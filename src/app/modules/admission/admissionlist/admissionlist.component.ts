import { query } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Inject , Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from '../../../services/admission.service';
import * as XLSX from 'xlsx';


declare var $;
@Component({
  selector: 'app-admissionlist',
  templateUrl: './admissionlist.component.html',
  styleUrls: ['./admissionlist.component.css']
})
export class AdmissionlistComponent implements AfterViewInit, OnInit {

  excelHeaderList: any[] = [];
  columnMappingList: any[] = [];
  importedadmissionList: any[] = [];
  individualAdmission: any = {};
  currentAdmission: any = {};
  admissionDetails: any[] = [];
  mappingColumn: any[] = [];
  admissionFileDetail: any = { admissionfile: '' };
  ngOnInit(): void {  }


  constructor(private _router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    public cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private _document: Document, private admissionService: AdmissionService) {
    this.loadAdmissionListData();
  }
  refreshPage() {
    this.loadAdmissionListData();
  }

  ngAfterViewInit() {

    

  }

/* Its to redirect to admission add page */
  addAdmissionItem() {
    this._router.navigate(['app/admission/add']);
  }

/* Its to redirect to admission edit page by loading admissioninfoid by query params */
  editPage(val) {
    this._router.navigate(['app/admission/edit'],
      {
        queryParams: { admissioninfoid: val.admissioninfoid }
      });
  }

  /* Its to load admission list details using service */

  loadAdmissionListData() {
    if ($('.erp-datatable').length) {
      if ($.fn.DataTable.isDataTable('.erp-datatable')) {
        var t = $('.erp-datatable').DataTable();
        t.destroy();
      }
    }
    this.admissionDetails = [];
    var listProm = this.admissionService.admissionListPromise()
    listProm.subscribe(result => {
      if (result && result.status && result.data && result.data.length > 0) {
        this.admissionDetails = result.data;
        console.log(this.admissionDetails, 'this.admissionDetails');
        this.cdr.detectChanges();
      }
      else {
        this.toastr.warning("No Admission Found");
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
    this.currentAdmission = data;
    this.ngxSmartModalService.getModal('deleteModalPopup').open();
  }

/* Its to close delete modal popup */
  closeRecord() {
    this.ngxSmartModalService.getModal('deleteModalPopup').close();
  }

/* Its to delete each row data of table using service */
  deleteData() {
    var deleteProm = this.admissionService.admissionDeletePromise(this.currentAdmission)
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
    this.ngxSmartModalService.getModal('importAdmissionPopup').close();
    this.admissionFileDetail.admissionfile = "";
  }

  checkProductDetails() {
    this.columnMappingList = [];
    var productProm = this.admissionService.getAdmissionList('ADMISSION'); // var productProm = this.admissionService.getAdmissionList('ADMISSION');
    productProm.subscribe(result => {
      this.columnMappingList = result.data.Table;
      console.log(result.data.Table);
    });
  }

  
  openImportModel(ev) {
    this.admissionFileDetail = {};
    this.ngxSmartModalService.getModal('importAdmissionPopup').open();
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

      this.importedadmissionList = jsonData.Sheet1;

      this.individualAdmission = this.importedadmissionList[0];

      Object.keys(this.individualAdmission);

      this.excelHeaderList = Object.keys(this.individualAdmission);
     
    }
    reader.readAsBinaryString(file);

  }
  

  submitAdmissionData() {

    var actualdata = [];
    this.importedadmissionList.forEach(item => {
      var obj = {};
      this.columnMappingList.forEach(data => {
        obj[data.columnname] = (data.givenname) ? item[data.givenname] : null;
      });
      actualdata.push(obj);
    });

    var productProm = this.admissionService.submitAdmissionPromise({ filename: this.admissionFileDetail.admissionfile, admissiondata: actualdata, categorytype: "ADMISSIONS" });
    productProm.subscribe(result => {
      if (result && result.status && result.data)
      {
        console.log(result.data);
        this.loadAdmissionListData();
        this.toastr.success(result.message);
        this.admissionFileDetail.admissionfile = "";
      }
      else
      {
        this.toastr.error(result.message);
      }
    });

    this.closeImportRecord();

  }
}
