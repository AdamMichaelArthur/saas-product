export enum Scope {
  public = "all",
  user = "user",
  account = "account"
}

export interface GlobalFlexTableInterface {
  headerButtonClicked(event: any)
  tableButtonClicked(requestResult: any)
}

export interface FlexTableOptions {

  /* State Buttons */
  // Sometimes, a record will be in a distinct state that requires different UI and handling, depending on the state.  We use State Buttons to handle.  
  // They are rendered and handled by the 'variable-state-button' component
  stateButtons: Array<any>;
  columnDecorators: object;
  columnBadges: object;
  scope: string;
  widths: Array<number>,
  columns: Array<string>,

  iconColumns: Array<object>            // This allows us to specify icons for any column we wish.  Then, a specified component
                                        // is loaded and provided with the _id of the row, for further processing

  datasource: string;                   // The mongo collection that will be used as the source of the table data

  enableColumnResize: boolean,

  bAutoLinks: boolean,                  // Scans for text, and if it starts wit http or https, turns it into a link.  Default false

  bNoHeader: boolean,

  columnPipes: Array<object>,

  bAllowDeletion: boolean,

  visibility: object,

  noIdAggregate: boolean,              // If you have an aggregate that produces data that doesn't produce a stanard _id, set this to true.

  linkColumns: Array<object>,

  filter: object,

  currencyCode: string,
  currencyColumns: Array<object>,

  conditionalBadges: Array<object>,                // Useful to display a badge based on row data.  

  sort: object,
  /* Table Header -- these are interactive elements that are above the <th> and <table> elements */
  fileUpload: Boolean,
  headerButtonsAr: Array<string>,
  headerButtonClicked: String,
  filters: Array<any>,

  columnNameRewrites: Array<string>,

  aggregate: object,
  // Examples
  // option1: string;
  // option2: number;
  // option3: boolean;
  // option4: Array<any>,
  hiddenColumns: object,                 // These are columns where we need the data, but we don't want to render a column for it.

	noTextColumns: Array<string>,	      	// This causes rows that otherwise would have
                                    		// text to not have text.  Typically would be
                                    		// used in conjunction with an tooltop icon replacing
                                    		// it

 	toggleIcons: Array<string>, 			    // These are icons that can be used as an 'on' or 'off'
                                    		// typically intended to be used for any data column that
                                    		// is true or false

 	menuIcons: Array<string>,        	    // These are used to make clickable menu icons for the table
                                    		// You can add a series of additional options here
 	menuIconOptions: Array<string>,    		// These are the options for the menu icon.

 	tooltipIcons: Array<string>,       		// These are icons that display the {{row}} as a tooltip

  rowButtons: Array<object>,            // An array of buttons, including which columns they should go into

            isDraggable: boolean,
            displayHeaders: boolean,
            displayHeader: boolean,
            displayOptions: boolean,
            compact: boolean,
            borders: boolean,
            headerDisplayText: string,
            displayRecord: number,
            

            buttons: string,
            dragdrop: string,
            buttonsAr: Array<string>,
            buttonNames: string,
            all: string,
            headerIcons: string,
            headerIconNames: string,
            tableIcons: string,
            tableIconNames: string

  //... other options
}

// const defaultFlexTableOptions: FlexTableOptions = {
//   rows: 3,
//   columns: 3,
//   width: 300,
//   height: 200,
// };

/*

        all="account" 
        widths="0,50,480,150,200,275,350,75,60,60,60" 
        displayAddDataToSource="false" 
        columns="selected,brand_name,release_for_bounty,spend,pipeline,keywords,titles,prompts" 
        displayFileUpload="false" 
        headerButtons="Add Bounty" 
        (onHeaderButtonClicked)="flextableHeaderButtonClicked($event)" 
        (sendHeaderButtons)="updateHeaderButtons($event)" 
        filters="{{ filtersStr }}" 
        filter="{{queueFilter}}"
        maxCharacters="150" 
        (tableButtonClicked)="tableButtonClicked($event)" 
        (sendTableButtons)="updateTableButtons($event)" 
        currencyColumns="m_b,spend,c_b" 
        (iconClicked)="showIconMenu($event)" 
        (tableDataChanged)="dateChanged($event)"
        noTextColumns="selected,queued_content" 
        menuColumns="queued_content"
        tableIcons="queued_content" 
        tableIconNames="local_phone,local_phone,format_paint,local_phone,local_phone" 
        sortableColumns="release_for_bounty" 
        viewSelectColumns="titles,prompts" 
        dragdrop="keywords,prompts,titles,prompts" 
        (receivedDropItem)="dropItemReceived($event)"
        (onDragStart)="onDragStart($event)" 
        (onDragEnd)="onDragEnd($event)" 
        (onDragEnter)="onDragEnter($event)" 
        (onDragLeave)="onDragLeave($event)" 
        (onDragOver)="onDragOver($event)" 
        (onDropEvent)="onDropEvent($event)"
        displayHeaderText="This is my text"
        (headerDropdownChanged)="headerDropdownChanged($event)"
        maxCharactersStr="20,50,20,20,20,50,10,10"
        buttons="brand_name,brand_name,brand_name"
        buttonNames="Template,Files,Details"
        selectedButtons="Delete Selected,Undeploy Keywords,Open Docs,Open Sheets,Archive,Edit Bulk,Select All"
        (dropdownItemDeleted)="dropdownItemDeleted($event)"

*/