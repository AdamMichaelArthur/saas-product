import { Component, OnInit, ElementRef, ViewChild, HostListener, Renderer2, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { FlexTableOptions } from './flextable-options';
import { BaseService } from '../../../legacy/base/base.service'
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ComponentFactoryResolver, Injectable, ViewContainerRef, Type } from '@angular/core';

@Component({
  selector: 'app-flextable',
  templateUrl: './flextable.component.html',
  styleUrls: ['./flextable.component.css']
})

export class FlextableComponent implements AfterViewChecked {

  red = 'red';
  
  @Input() options!: Partial<FlexTableOptions>;
  @Output() dataLoaded = new EventEmitter<void>();
  showFiller = false;

  pipe = "USD"

  defaultFont = 'Arial'

  private resizingColumn: HTMLElement | null = null;
  private startX = 0;
  private startWidth = 0;

  constructor(private renderer: Renderer2, private service: BaseService,
    private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) {}

  tableData = {
    displayHeaders: [],
    headers: [],
    rows: [],
    addDataForm: [],
    pagination: {},
    rowIds: [],
    selectedRows: [],
    noIdAggregate: false,
    columnNameRewrites: [],
    iconColumns: []
  } 

  async ngOnInit() {
    // Initialize our dropdown headers.  This fetches data from the server and populates the filter downdowns
    this.initializeDropdownFilters();

    try {
      console.log(46, this.options.columns);
      let options = JSON.parse(JSON.stringify(this.options))
      var data: any = await this.service.getInitialDataTableList(options.datasource, 10, options.columns, options.scope, options.filter, options.sort, options.aggregate);
      this.options = options;
      this.dataLoaded.emit();
      console.log(47, options.columns, data);
      this.tableData = data;
      this.harmonizeRowsAndHeaders(data[options.datasource]);
      this.initResizeIndicators()      
    } catch(err){
      this.dataLoaded.emit();
      //alert(this.options.datasource)
      console.log(51, "Unable to load table data");
    }
    


  }

  async refreshTable(){
    console.log(59, "Refreshing");

    this.initializeDropdownFilters();

    var data: any = await this.service.getInitialDataTableList(this.options.datasource, 10, this.options.columns, this.options.scope, this.options.filter, this.options.sort, this.options.aggregate);
    console.log(7170, this.options, data)
    this.tableData = data;
    this.harmonizeRowsAndHeaders(data[this.options.datasource]);
    
    // this.service.getInitialDataTableList(this.options.datasource, 10, this.options.columns, this.options.scope,
    //   this.options.filter, this.options.sort, this.options.aggregate).subscribe(
    //     (data: any) => {
    //         this.tableData = data;
    //         this.harmonizeRowsAndHeaders(data[this.options.datasource]);
            // this.initResizeIndicators()
            // this.bIsDeleting = false;
            // this.clickedColumnIndex = null;
    //     })
  }

  refreshTableStayOnPage(){

  }

  harmonizeRowsAndHeaders(rows){

    //console.log(52, rows);
    
    let arrRows = [];
    let idsAr = [];
    let selectedRows = [];
    for(let dataRow of rows){

        let keys = Object.keys(dataRow);
        let values = Object.values(dataRow);
        //let row: any = [ { "data": 'a', "formDefinition": fd }, { "data": 'b', "formDefinition": fd }, { "data": 'c', "formDefinition": fd }, { "data": 'd', "formDefinition": fd }, { "data": 'e', "formDefinition": fd } ];//Array.from({ length: this.tableData.headers.length }, () => Object());

        let row: any = [ ]

        let _id: string = "";
        let selected: boolean = false;

        //let arrayOfArrays = Array.from({ length: keys.length }, () => []);

        var testDelete = {

        }

        for(var del of this.tableData.headers){
            testDelete[del] = true
        }

        for(let key of keys){
          for(let dataHeader of this.tableData.headers){
            if(dataHeader == key){
              delete testDelete[key];
            }
        }}        



        //console.log(83, keys, testDelete)

        for(let key of keys){
          for(let dataHeader of this.tableData.headers){
            //console.log(68, dataHeader, key)
            if(dataHeader == key){
              delete testDelete[key];
              let formDefinition =  {
                  "field_label": "",
                  "field_name": "",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  }
              }

              for(let def of this.tableData.addDataForm){
                if(def.field_name == key){
                  formDefinition = def;
                }
              }


              // Determine the matching index of the header
              //const index = this.tableData.headers.findIndex((element) => element === key);
              // let bHasIndex = true;
              // if(this.options.columns[0] !== '_id'){
              //   bHasIndex = false;
              // }
              // let incrementor = 2;
              // if(!bHasIndex){
              //   incrementor = 1;
              // }

              let index = this.options.columns.findIndex((element) => element === key);
              //let index = this.tableData.headers.findIndex((element) => element === key);
              //index = index - incrementor;


              //console.log(58, "The index of", key, "is", index, row);
              //arrayOfArrays[index] = { "data": dataRow[key], "formDefinition": formDefinition }
              row[index] = { "data": dataRow[key], "formDefinition": formDefinition } 
            }
            
            if(key == "_id"){
              _id = dataRow[key];

            }
            if(key == "selected"){
              selected = dataRow[key];
            }
          }
        }


      idsAr.push(_id);
      selectedRows.push(selected);
      arrRows.push(row);
    }

    this.tableData.rows = arrRows;
    this.tableData.rowIds = idsAr;
    this.tableData.selectedRows = selectedRows;
    this.displayDeleteManyButton();
    this.bIsLoading = false;

    if(this.options.bAutoLinks === true){
      this.convertToLinks();
    }
  }

  @ViewChild('container', { static: false }) container: ElementRef;

  convertToLinks(){

    const containerElement: HTMLElement = this.container.nativeElement;
    // I'm not in love with using a timer here.  The issue is we need to perform this action After everything has rendered 
    // The proper way to do this is ngAfterViewChecked(), as there's no guarantee that 500 ms is enough time.  It might also be too much
    setTimeout( () => {
      this.convertTextToLink(containerElement);
    }, 500)
    
  }

   convertTextToLink(element: HTMLElement): void {
      const childNodes = element.childNodes;
      for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
        
        // Check if the node is a text node and contains a link-like text
        if (node.nodeType === Node.TEXT_NODE && this.isLinkLikeText(node.nodeValue)) {
          const linkElement = this.renderer.createElement('a');
          this.renderer.setProperty(linkElement, 'href', node.nodeValue);
          this.renderer.setProperty(linkElement, 'target', '_blank');
          this.renderer.appendChild(linkElement, this.renderer.createText(node.nodeValue));
          
          // Replace the text node with the link element
          this.renderer.insertBefore(element, linkElement, node);
          this.renderer.removeChild(element, node);
        }
        
        // Recursively process child nodes if any
        if (node.childNodes && node.childNodes.length > 0) {
          this.convertTextToLink(node as HTMLElement);
        }
      }
    }
    
    isLinkLikeText(text: string): boolean {
      const linkRegex = /^\s*(http|https):\/\/\S+\s*$/i;
      return linkRegex.test(text);
    }

  @HostListener("window:resize")
  onWindowResize() {
    this.hideTableHeadersOnMobile();
  }

  hideTableHeadersOnMobile() {
    const tableHeaders = document.querySelectorAll(
      ".table-responsive table thead tr"
    );
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;

    const selectElements = document.querySelectorAll("select.form-select");
    for (let i = 0; i < selectElements.length; i++) {
      const selectElement = selectElements[i] as HTMLElement;
      //selectElement.className = 'form-select mt-2 mt-md-0';
      if (windowWidth <= 767) {
        selectElement.classList.remove("custom-select-width");
        selectElement.classList.remove("button-spacing");
        selectElement.classList.add("custom-select-padding");
      } else {
        selectElement.classList.add("custom-select-width");
        selectElement.classList.add("button-spacing");
        selectElement.classList.remove("custom-select-padding");
      }
    }

    const containerDiv = document.querySelector(".col-md-12") as HTMLElement;
    if (windowWidth <= 767) {
      containerDiv.classList.add("flex-wrap");
    } else {
      containerDiv.classList.remove("flex-wrap");
    }

    if (windowWidth <= 767) {
      for (let i = 0; i < tableHeaders.length; i++) {
        (tableHeaders[i] as HTMLElement).style.display = "none";
      }
    } else {
      for (let i = 0; i < tableHeaders.length; i++) {
        (tableHeaders[i] as HTMLElement).style.display = "";
      }
    }
  }

  initResizeIndicators() {
    
    
    // This is a hack.  The best-practices way to do this is to push any relevant network requests in an array of promises
    // Wait for all requests to complete, and then to initialize here.  But I've got other, more important, things to do at
    // the moment.

    setTimeout( () => {
      const resizeIndicators = document.querySelectorAll(".resize-indicator");
      resizeIndicators.forEach((indicator) => {
        this.renderer.listen(indicator, "mousedown", (event) => {
          
          this.resizingColumn = indicator.parentElement;
          this.startX = event.pageX;
          this.startWidth = this.resizingColumn?.offsetWidth ?? 0;
          this.renderer.addClass(this.resizingColumn, "resizing");
          this.setTableContentUserSelect("none");
          this.renderer.listen(
            "document",
            "selectstart",
            this.disableTextSelection
          );
        });
      });

    }, 5000)


  }

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(event: MouseEvent) {
    if (this.resizingColumn) {
      const width = this.startWidth + (event.pageX - this.startX);
      this.resizingColumn.style.width = width + "px";
    }
  }

  @HostListener("document:mouseup")
  onMouseUp() {
    if (this.resizingColumn) {
      this.renderer.removeClass(this.resizingColumn, "resizing");
      this.resizingColumn = null;
      this.setTableContentUserSelect("");
      this.renderer.listen(
        "document",
        "selectstart",
        this.disableTextSelection
      );
    }
  }

  private disableTextSelection(event: Event) {
    event.preventDefault();
  }

  private setTableContentUserSelect(value: string) {
    const tableCells = document.querySelectorAll("td");
    tableCells.forEach((cell) => {
      this.renderer.setStyle(cell, "user-select", value);
    });
  }

  /* Dynamic Header Buttons */
  @Output() headerDropdownChanged = new EventEmitter<object>();

  // onHeaderBtnClicked is called with a (click) is triggered in the element.  We then emit an event, headerButtonClicked, to notify the host component
  @Output() headerButtonClicked = new EventEmitter<string>();
  onHeaderBtnClicked(btnName: string) {
    this.headerButtonClicked.emit(btnName);
  }

  /* Pulls Filter Options From The Database */
  filtersAr: { [key: string]: any }[] = [];
  filterLabelsAr: any[][] = [];

  options2 = ["Option 1", "Option 2", "Option 3"];
  selectedOption: string;

  initializeDropdownFilters() {
    if (!Array.isArray(this.options.filters)) {
      return;
    }

    const promises = [];

    for (var i = 0; i < this.options.filters.length; i++) {
      let filter: any = this.options.filters[i];
      // Put our filters into an array
      this.filtersAr.push(filter.filter);

      // Initialize an empty nested array
      this.filterLabelsAr[i] = [];
      this.filterLabelsAr[i].push(filter.label);

      var advancedFilter = null;
      if (this.options.scope == "all") {
        advancedFilter = "all";
      }

      if (typeof this.options.filters[i].filterLabels != "undefined") {
        for (var y = 0; y < this.options.filters.length; y++) {
          if (i == y) {
            this.filterLabelsAr[y] = this.options.filters[i].filterLabels;
          }
        }
      }

      const myPromise: Promise<any> = new Promise((resolve, reject) => {
        this.service
          .getFilterOptions(this.options.filters[i], advancedFilter)
          .subscribe((data: any) => {
            resolve(data);
          });
      });
      promises.push(myPromise);
    }

    Promise.all(promises)
      .then((results) => {
        for (let result of results) {
          for (var y = 0; y < this.options.filters.length; y++) {
            if (this.options.filters[y].datasource == result.datasource) {
              this.filterLabelsAr[y] = this.filterLabelsAr[y].concat(
                result[result.datasource]
              );
            }
          }
        }
        this.finished = true;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  finished: boolean = false;
  bIsLoading: boolean = true;
  bNever: boolean = false;
  ngAfterViewChecked() {
    // DOM changes have been rendered
    if (this.finished == true) {
      this.hideTableHeadersOnMobile();
      if(this.bNever == false){
        setTimeout(() => {
          this.bNever = true;
        }, 1500)

      }
      this.bIsLoading = false;
    }
  }

  resetFilters(){
    this.combinedFilter = {}
  }

  combinedFilter = {}
  filter = {}
  aggregateOrig: any = {}
  aggregate: any = {}

  async onFilterSelected(filter, value, label ="") {

    var dropdownData = {
      "filter": "filter",
      "value": value,
      "label":label
    }

    var filterObj = this.options.filters[filter];

    this.headerDropdownChanged.emit(dropdownData);
    
    if (filterObj.filter == false) {
      // The purpose here is a simple dropdown...
      // By selecting this option, we are indicating that we do NOT WANT to do a network request 
      // Presumeably, you need this dropdown for UI purposes inside the component that is hosting
      // the FlexTable.  So, we return here and do nothing.  Any action as a result needs to be handled
      // by the host component, when it received a "headerDropdownChanged" event.
      return;
    }
    
    var mongoFindQuery = filterObj.filter;

    if(filterObj.key != "")
      mongoFindQuery[filterObj.key] = value;

    this.combinedFilter = { ... this.combinedFilter, ... mongoFindQuery }

    if(value == label){
      delete this.combinedFilter[this.options.filters[filter].key]
    }

    this.filter = this.combinedFilter;

    if(typeof this.options.aggregate !== 'undefined'){
    var aggregate: any = this.options.aggregate
    if(Object.keys(aggregate).length > 0){

      var match = { "$match": this.filter }
      
      if(Object.keys(this.aggregateOrig).length == 0) {  
        this.aggregateOrig = aggregate;
      } else {
         aggregate = this.aggregateOrig
      }

      if(Object.keys(this.filter).length > 2){
        // I don't remember why I did this, but there was a good reason.  I'm sure it'll become apparent during testing
        var output = aggregate.slice(2);
        aggregate = output;
      }
    } else {
        var aggregate: any = false;
    }}

    var data: any = await this.service.getInitialDataTableList(this.options.datasource, 10, this.options.columns, this.options.scope, this.filter, "", aggregate);
    this.tableData = data;
    this.harmonizeRowsAndHeaders(data[this.options.datasource]);
        
  }

  Page(page_endpoint: String){

    this.service.loadingDataTablePagination(page_endpoint, this.options.columns).subscribe(
      (data: any) => {
            this.tableData = data;
            this.harmonizeRowsAndHeaders(data[this.options.datasource]);
      });
  }

  /* (click) events */
  getIdByRow(row){
    return this.tableData.rowIds[row];
  }
  
  getRowByIndex(index){
    return this.tableData[this.options.datasource][index];
  }

  rowButtonClicked(event){
    console.log(350, "Row Clicked");
  }

  onTextClicked(event){
    console.log(354, "Text Clicked");
  }

  onNumberClicked(event){
    console.log(354, "Number Clicked");
  }

  onIconClicked(event){
    console.log(358, "Icon Clicked");
  }

  onColumnClicked(event){
    console.log(362, "Column Clicked");
  }

  // onDragIconClicked(event){
  //   console.log(366, "Drag Icon Clicked");
  // }

  onHeaderClicked(event){
    console.log(366, "Header Clicked");
  }

  duplicateIconClicked(event){
    console.log(370, "Duplicate Icon Clicked");
  }

  clickedColumnIndex: number | null = null;
  bIsDeleting = false;
  async deleteIconClicked(event, rowIndex){

    if(this.bIsDeleting){
      console.warn("Only one delete operation should be done at a time");
      return;
    }
    this.bIsDeleting = true;
    this.clickedColumnIndex = rowIndex;

    this.service.key = this.options.datasource;

    let _id = this.getIdByRow(rowIndex);

    try {
      var deleteResult = await this.service.deleteById(_id).toPromise();
      // Handle the data here
    } catch (error) {
      // Handle any errors that occurred during the request
    }


    // If rowIndex == 0, we handle it just a little different....
    let currentPage = this.tableData.pagination["current_page"];

    var bRefreshEntireTable = false;
    try {
      var { page_endpoint } = this.tableData.pagination['pages'].find(obj => obj['page_number'] === currentPage);
    } catch(err){
      bRefreshEntireTable = true;
    }


    console.log(514, deleteResult, page_endpoint);

    let currentPageUrl = page_endpoint

    if(bRefreshEntireTable){
      await this.refreshTable();
      return;
    }

    this.service.loadingDataTablePagination(page_endpoint, this.options.columns).subscribe(
        (data: any) => {
            this.tableData = data;

            this.harmonizeRowsAndHeaders(data[this.options.datasource]);
            this.initResizeIndicators()
            this.clickedColumnIndex = null;
            this.bIsDeleting = false;
        })

  //     deleteById(id) {
  //   var key = this.key
  //   var api_url = this.baseUrl + '/datasource/' + key + '/id/' + id;
  //   return this.http.delete(api_url, this.httpOptions).pipe(map(response => {
  //     return response
  //   }), catchError(this.handleError))
  // }
  }

  async deleteSelectedRecords(){
    alert("This will delete selected records");
    this.bIsLoading = true;
    try {
      var deleteResult = await this.service.deleteSelected(this.options.datasource).toPromise();
    } catch (error) {
    }
    let currentPage = this.tableData.pagination["current_page"];

    const { page_endpoint } = this.tableData.pagination['pages'].find(obj => obj['page_number'] === currentPage);

    let currentPageUrl = page_endpoint

        this.service.loadingDataTablePagination(page_endpoint, this.options.columns).subscribe(
        (data: any) => {
            this.tableData = data;
            this.harmonizeRowsAndHeaders(data[this.options.datasource]);
            this.initResizeIndicators()
            this.clickedColumnIndex = null;
            this.bIsDeleting = false;
            this.bIsLoading = false;
        })
  }

  dateIconClicked(event){
    console.log(374, "Date Icon Clicked");
  }

  closeModalClicked(event){
    console.log(378, "Clode Modal Clicked");
  }

  /*   This sends the request to the backend and emits the response to the host component to handle any result 
       As of 6/6/23 I am using proxy rules to send these to the old backend
  */
  @Output() tableBtnClicked = new EventEmitter<object>(); /* Used to notify the host component the results of the network request, so it can be further handled */
  tableButtonClicked(event, rowIndex, buttonName: any = ""){
    let _id = this.getIdByRow(rowIndex);
    let row = this.getRowByIndex(rowIndex);
    console.log(648, row);
    this.tableBtnClicked.emit({ _id: _id, "row": row, "buttonName": buttonName });
    console.log(637, "Table Button Clicked", buttonName, event);
    // let _id = this.getIdByRow(rowIndex);
    // this.service.dynamicButton(this.options.datasource, _id, action).subscribe(
    //   (data: any) => {

    //     // // Display a popup here of the button results
    //     data.actions["_id"] = _id;
    //     data.actions["key"] = this.options.datasource;
    //     data.actions["button"] = action;
    //     data.actions["row"] = rowIndex;
    //     this.tableBtnClicked.emit(data.actions);
    //   }
    // )
  }

  onSelectCheckboxClicked(event, row){
    let _id = this.getIdByRow(row);
    console.log(382, row, "Select Row Checkbox Changed", _id);

    this.service.rowSelected(this.options.datasource, _id).subscribe(
      (data: any) => {
        console.log(410, data);
      });
    this.tableData.selectedRows[row] = !this.tableData.selectedRows[row];
    this.displayDeleteManyButton();
  }

  onSelectClicked($event, row){
    console.log(399, "Select changed");
  }

  onChangeMaxRecords($event){

  }

  /* Delete selected rows */
  bShowDeleteManyButton: boolean = false;
  bShowSelectManyButton: boolean = false;
  sShowSelectManyButtonText: string = "";

  displayDeleteManyButton(){
    let bHasSelectedRows = false;
    if (this.tableData.selectedRows.some(value => value === true)) {
      bHasSelectedRows = true;
    }
    this.bShowDeleteManyButton = bHasSelectedRows;
    this.bShowSelectManyButton = bHasSelectedRows;
    this.sShowSelectManyButtonText = `Select ${this.tableData.pagination['total_records']} Rows`
    //console.log(462, this.tableData.pagination['total_records']);
  }

  selectAllRecords(){

    alert("This will select all records");

    this.service.selectAllRows(this.options.datasource, this.options).subscribe(
      (data: any) => {

    });

  }



  @Output() activePanel = new EventEmitter<object>();

  activatePanel($event, rowIndex, component){

    let _id = this.getIdByRow(rowIndex);

    this.activePanel.emit({ component: component, _id: _id } );

    // console.log(607, rowIndex, component, path);
    // this.drawer.toggle()
    // this.showFiller = !this.showFiller 





  }

  networkActionCompleted(buttonInfo){
    
    console.log(745, buttonInfo);

    this.refreshTable()
    let _id = this.getIdByRow(buttonInfo.rowIndex);
    let row = this.getRowByIndex(buttonInfo.rowIndex);
    this.tableBtnClicked.emit({ _id: _id, "row": row, "buttonName": buttonInfo.buttonName });

  }

  test12345 = false;

}
