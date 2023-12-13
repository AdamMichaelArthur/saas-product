import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  constructor(
    public http: HttpClient,
    public cookieService: CookieService,
    public router: Router,
  ) {
    
  }
  addfilearea = true;
  @Input() filter = "";
  @Input() key: any;
  @Input() fileFormat: any;
  @Input() addDataFormStr: any;
  @Output() displayAddFileAreaBoolean = new EventEmitter<boolean>();
  @Output() emitTmpIDForExcelUpload = new EventEmitter<any>();
  @Input() validation: any = {}
  excelFileFormat: any

  service: any;
  ngOnInit(): void {
    this.service.key = this.key

  }

  closeFileUpload(){
    this.addfilearea = !this.addfilearea
    this.displayAddFileAreaBoolean.emit(this.addfilearea);
    // this.tableButtonSubviews[0] = false
  }
  

  //  excel file upload with validation 
  excel_loaded: boolean = false;
  excelloaded: boolean = false;
  excelSrc: string = "";
  initialExcel: string = "";
  currentExcel: string = "";
  excel_file_Error: string = "";
  excel_file_Info: string = "";
  excelFileData = {};
  addfile = false
  opendataSource = false
  // tmpIdForExcelUpload: any = null;

  _validFileExtensions = [".xlsx", ".xls", ".csv"];
  Validate(e) {
    // var file = e.target.files[0];
    // var pattern = /.spreadsheetml.sheet/;
    // var reader = new FileReader();

    // console.log(67, e.target.files);

    // // if (!file.type.match(pattern)) {
    // //   // alert('invalid format');
    // //   this.excel_file_Error = "invalid file Format";
    // //   return;
    // // } else {
    // //   this.excel_file_Error = "";
    //   this.excel_file_Info = "Chosen File Name: " + file.name;
       this.excelFileData = e.target.files;

    //   this.excel_loaded = false;
    //   reader.onload = this.excelIsloaded.bind(this);
    //   reader.readAsDataURL(file);
    // //}
     this.openFileUpload()
  }

  // Open close file upload popup
  openFileUpload() {
    this.addfile = true
    this.opendataSource = true;
    var div = document.getElementById("addfile");
    var button = document.getElementById("addfileBtn")
    var buttonRect = button.getBoundingClientRect();
    var container = document.getElementById("page_container").getBoundingClientRect();
    // div.style.top = String(buttonRect.bottom) + "px"
    var divRect = document.getElementById("addfileBtn").getBoundingClientRect();
    //var container = document.getElementById("page_container").getBoundingClientRect();
    var test = divRect.left - container.left

    // div.style.left = test + "px";
    this.uploadExcelFile()
  }

  excelIsloaded(evt) {
    var reader = evt.target;
    this.currentExcel = reader.result;
    const result = reader.result;
    if (result.length * 2 > 2 ** 21) {
      this.excel_loaded = false;
    } else {
      this.excel_loaded = true;
    }
  }

  cancelExcel() {
    this.currentExcel = "";
    this.excel_loaded = false;
  }

  // excel file upload related functions with service
  file_status = "Submit File";
  uploading = false;
  fileUploadError = false
  errorMessage = ""

  uploadExcelFile() {

    this.file_status = "Uploading File...";
    this.uploading = true;
    var params = "";
    var extraParams = []

    // for (let i = 0; i < this.excelFileFormat.length; i++) {
    //   var row = {
    //     "field_name": this.excelFileFormat[i].field_name,
    //     "required": this.excelFileFormat[i].validation.required
    //   }

    //   extraParams.push(row)
    // }

    console.log(133, extraParams)

    if (this.filter.length > 0) {
      params = this.filter;
    }

     console.log(1067, this.excelFileData, params, this.validation);
     
    this.service
      // .uploadExcelFile(this.excelFileData, params, this.filter)
      .uploadExcelFile(this.excelFileData, JSON.stringify({ ... JSON.parse(params), validation: this.validation }))
      .subscribe(
        (data: any) => {
          if (data.Result === "Failure") {
            this.excel_loaded = false;
            this.fileUploadError = true;
            this.uploading = false;
            console.log(data)
            this.errorMessage = data.ErrorDetails.Description
          } else {
            this.excel_loaded = false;
            this.uploading = false;
            this.excel_file_Info = "File uploaded successfully!";
            console.log(1077, JSON.stringify(this.filter))
            // this.filter = this.tmpIdForExcelUpload
            this.emitTmpIDForExcelUpload.emit(this.filter);
            // this.getInitialDataTableList(0, JSON.stringify(this.tmpIdForExcelUpload));
            // setTimeout(() => {
            //   //console.log("11")
            //   this.addfile = true;
            // }, 3000)
          }
        },
        error => {
          console.log(JSON.stringify(error))
          this.excel_loaded = false;
          this.excel_file_Info = "";
          this.excel_file_Error = "File dropped! Please reselect file!";
        });
  }

}
