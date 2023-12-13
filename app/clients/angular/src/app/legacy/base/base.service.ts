import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { map, take, catchError, timeout } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import Voca from 'voca'

import { BaseComponent } from './base.component'

@Injectable({
   providedIn: 'root'
})

/*  Notes 6/4/23

    This is a port from Content Bounty.  There are meaningful differences in versions and coding approaches between
    the two projects, and code cannot be easily cut and paste.  

    This is a port of the "base" service, which is used extensively in Content Bounty and as needed here in order
    to port over some of the other useful functionality from that project.

    I don't have the time or desire to reengineer those solutions, though dated they have been extensively tested
    and work well.  

    With any luck, the port will be superficial and won't break much.

*/

export class BaseService {

  public datasourceUrl: any = "";

  constructor(public http: HttpClient, public cookieService: CookieService, public router: Router) {

  }


  public baseUrl = environment.apiBase
  private api_url = this.baseUrl + '/datasource/brand';
  public key = "";

  httpOptions = { headers: new HttpHeaders({ 'accept': 'application/json', 'Content-Type': 'application/json' }), "withCredentials": true };

  private subject = new Subject < any > ();

  test123() {
      var api_url = this.baseUrl + '/actions/datasource/user/action/balance'
      return this.http.get(api_url, this.httpOptions).pipe(map(response => {
        {
          return response
        }
      }), catchError(this.handleError))
  }

  updateProfileImage(imageUrl: any) {
    this.subject.next({
      imageUrl: imageUrl
    });
  }

  getProfileImage(): Observable < any > {

    return this.subject.asObservable();
  }

  private subjectFirstName = new Subject < any > ();

  updateFirstName(first_name: any) {

    this.subjectFirstName.next( { first_name: first_name } ) ;
  }

  getFirstName(): Observable < any > {

    return this.subjectFirstName.asObservable();
  }

  checkOutBalance() {
      var api_url = this.baseUrl + '/actions/datasource/user/action/balance'
      return this.http.get(api_url, this.httpOptions).pipe(map(response => {
        {
          return response
        }
      }), catchError(this.handleError))
  }

  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {

      console.error('An error occurred:', error.error.message);
    } else {

      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    var errorMessage = error.error.ErrorDetails.Description

    if (errorMessage) {
      return throwError(error.error)
    } else {
      return throwError(`${JSON.stringify(error)}`);
    }
  };

  last_post_body = null
  last_aggregate_body = null
  

  async getInitialDataTableList(key: any, maxrecords = 0, columns:any = "", all = "", filter: any ={}, sort ={}, aggregate: any = false) {

    //console.log(116, key, maxrecords, columns, all, filter, sort, aggregate)

    if(Array.isArray(columns)){
      columns = columns.toString()
    }

    var max_records: any = "";
    this.key = key;
    if (maxrecords > 0)
      max_records = "/max_records/" + String(maxrecords);
    else
      max_records = "";

    if (all != "")
      all = all + "/";

    var post = false;
    var postBody = {}

    if (aggregate != false) {
      key = key + "/aggregate/";
      post = true;
      postBody = {
        "aggregate": btoa(Voca.replaceAll(JSON.stringify(aggregate), "\"$res.locals.user._id\"", "$res.locals.user._id"))
      }

      this.last_post_body = postBody
      this.last_aggregate_body = postBody;
    }

    var api_url = this.baseUrl + '/datasource/' + key + max_records + "/" + all


    if (Object.keys(filter).length > 0) {
      try {
        api_url = api_url + "filter/" + btoa(JSON.stringify(filter));
      } catch(err){
        // filter is probably not a valid JSON object....
      }
    }

    if (Object.keys(sort).length > 0) {
      api_url = api_url + "/sort/" + btoa(JSON.stringify(sort))
    }

    this.datasourceUrl = api_url;

    if (columns.length > 0) {

      this.httpOptions = {
        headers: new HttpHeaders({
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }),
        "withCredentials": true
      };

      this.httpOptions.headers = this.httpOptions.headers.append("x-body", columns);
    }

    //if(false === post){

    //} else {
      console.log(179, "Should make network request", api_url);
      let rVal = await this.http.post(api_url, postBody, this.httpOptions).toPromise();
      console.log(181, rVal);
      return rVal;
      try {
        return await this.http.post(api_url, postBody, this.httpOptions).toPromise();
      } catch(err){
        console.log(182, err);
        return this.handleError(err)
      }
    //}
    // if (post == false) {
    //   console.log(185, api_url);
    //   return this.http.get(api_url, this.httpOptions).pipe(map(response => {
    //     return response
    //   }), catchError(this.handleError))
    // } else {

    //   return this.http.post(api_url, postBody, this.httpOptions).pipe(map(response => {
    //     return response
    //   }), catchError(this.handleError))
    // }
  }


  getAggregateCount(key, maxrecords = 0, columns = "", all = "", filter = "", sort = "", aggregate: any = false) {

    var max_records: any = "";
    this.key = key;
    if (maxrecords > 0)
      max_records = "/max_records/" + String(maxrecords);
    else
      max_records = "";

    if (all != "")
      all = all + "/";

    var post = false;
    var postBody = {}

    key = key + "/count/";
    post = true;
    postBody = {
      "aggregate": btoa(aggregate)
    }

    var api_url = this.baseUrl + '/datasource/' + key + max_records + "/" + all

    if (filter != "") {
      api_url = api_url + "filter/" + btoa(filter)
    }

    if (sort != "") {
      api_url = api_url + "/sort/" + btoa(sort)
    }

    this.datasourceUrl = api_url;

    if (columns.length > 0) {

      this.httpOptions = {
        headers: new HttpHeaders({
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }),
        "withCredentials": true
      };

      this.httpOptions.headers = this.httpOptions.headers.append("x-body", columns);
    }

    this.last_aggregate_body = postBody
    return this.http.post(api_url, postBody, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))

  }

  getFilterOptions(filter, advanced = null) {

    var all = "";

    if (advanced == null) {
      if (typeof filter.all != 'undefined') {
        if (filter.all == false) {
          all = "";
        } else {
          all = "all"
        }
      }
    } else {
      all = advanced
    }

    if (filter.all == false) {
      all = "";
    }

    var api_url = this.baseUrl + '/datasource/' + filter.datasource + "/distinct" + "/" + filter.distinct + "/" + all

    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))

  }

  loadingDataTablePagination(url, columns: Array<string>) {
    console.log(96, 'loadingDataTablePagination', url, this.baseUrl, columns)

    if (columns.length > 0) {

      this.httpOptions = {
        headers: new HttpHeaders({
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }),
        "withCredentials": true
      };

      console.log(70, columns);
      this.httpOptions.headers = this.httpOptions.headers.append("x-body", columns.toString());
    }

    this.datasourceUrl = url;
    if (this.last_aggregate_body != null) {

      console.log(244, url, 'Posting Aggregate', this.last_aggregate_body);

      return this.http.post(url, this.last_aggregate_body, this.httpOptions).pipe(map(response => {
        return response
      }), catchError(this.handleError))

    }

    console.log(298, url);

    return this.http.get(url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))

  }

  deleteById(id) {
    var key = this.key
    var api_url = this.baseUrl + '/datasource/' + key + '/id/' + id;
    console.log(api_url)

    return this.http.delete(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))
  }

  downloadFile() {
    var key = 'salma'
    var api_url = this.baseUrl + '/datasource/export/' + key;
    console.log(api_url);

    const httpOptionssss = {
      headers: new HttpHeaders({
        'accept': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };
    return this.http.get(api_url, httpOptionssss).pipe(map(response => {
      console.log("Response from service file !!")
      console.log(response)
      return response
    }), catchError(this.handleError))
  }

  duplicateById(id) {
    var key = this.key
    var api_url = this.baseUrl + '/datasource/' + key + '/clone/id/' + id;
    console.log(api_url)
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))
  }

  editDataById(id, body) {
    var api_url = this.baseUrl + '/datasource/' + this.key + '/id/' + id;
    console.log(188, api_url, id, body);
    return this.http.patch(api_url, body, this.httpOptions).pipe(
      timeout(3000),
      map(response => {

        return response
      }), catchError(this.handleError))
  }

  putDataById(id, body) {
    var api_url = this.baseUrl + '/datasource/' + this.key + '/id/' + id;
    console.log(188, api_url, id, body);
    return this.http.put(api_url, body, this.httpOptions).pipe(map(response => {

      return response
    }), catchError(this.handleError))
  }

  addDataById(id, body) {
    var api_url = this.baseUrl + '/datasource/' + this.key + '/id/' + id;

    return this.http.put(api_url, body, this.httpOptions).pipe(map(response => {

      return response
    }), catchError(this.handleError))
  }

  searchValueInList(values, key, header, all = false, aggregate: any = false) {

    var header = header
    var api_url = this.baseUrl + '/datasource/' + this.key + '/search/' + header + '/' + values;

    if (all != false) {
      api_url = api_url + "/all/" + all;
    }

    if (aggregate != false) {
      api_url = api_url + /searchaggregate/ + btoa(aggregate)
    }

    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))

  }

  httpOptionsForExcel = {
    headers: new HttpHeaders({
      accept: 'application/x-www-form-urlencoded'
    }),
    withCredentials: true
  }

  uploadExcelFile(body, params = "", extraParams = null) {

    const formData = new FormData();

    for (var i = 0; i < body.length; i++) {
      formData.append("file[]", body[i]);
    }

    if (extraParams != null) {
      var newObj = {
        ...JSON.parse(params),
        ...extraParams
      };
      params = JSON.stringify(newObj);
    }

    console.log(270, extraParams, newObj, params);

    var api_url = this.baseUrl + '/datasource/import/' + this.key
    if (params.length > 0) {

      api_url += ("?params=" + btoa(params))
    }
    console.log(175, api_url);

    this.last_post_body = formData;

    return this.http.post(api_url, formData, this.httpOptionsForExcel).pipe(
      map(response => {
        this.getInitialDataTableList(this.key)
        console.log(JSON.stringify(response))
        return response;
      }),
      catchError(this.handleError)
    );
  }

  addDataToSourceForm(body, filters = null) {
    var api_url = this.baseUrl + '/datasource/' + this.key
    if (filters != null) {
      body = {
        ...body,
        ...filters
      }
    }
    console.log(162, api_url);
    this.last_post_body = body;
    return this.http.post(api_url, body, this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  private item: any = '';

  setDataSourceValue(item: any) {
    this.item = item;
  }

  getDataSourceValue() {

    console.log(this.item + "from flex table service !!")
    return this.item;
  }

  removeKeyValueFromDocument(key, documentId) {

  }

  public getDistinctArray(datasource, distinct, all = true) {
    var key = datasource;

    var getAll = "/all";
    if (all == false)
      getAll = '';

    var api_url = this.baseUrl + '/datasource/' + key + '/distinct/' + distinct + getAll;

    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {
        return response[response["datasource"]];
      }),
      catchError(this.handleError)
    );
  }

  public getDistinctArrayWithIds(datasource, distinct, all = true) {
    var key = datasource;

    var getAll = "/all";
    if (all == false)
      getAll = '';

    var api_url = this.baseUrl + '/datasource/' + key + '/distinctids/' + distinct + getAll;

    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {
        return response[response["datasource"]];
      }),
      catchError(this.handleError)
    );
  }

  public getDistinctArrayWithFilter(datasource, distinct, filter) {
    var key = datasource;

    var api_url = this.baseUrl + '/datasource/' + key + '/distinct/' + distinct;

    this.last_post_body = filter;
    return this.http.post(api_url, filter, this.httpOptions).pipe(
      map(response => {
        return response[response["datasource"]];
      }),
      catchError(this.handleError)
    );
  }

  public getDistinctArrayWithIdsAndFilter(datasource, distinct, filter) {
    var key = datasource;

    var api_url = this.baseUrl + '/datasource/' + key + '/distinctids/' + distinct;

    this.last_post_body = filter
    return this.http.post(api_url, filter, this.httpOptions).pipe(
      map(response => {
        return response[response["datasource"]];
      }),
      catchError(this.handleError)
    );
  }

  public getDistinctTemplateById(datasource, distinct) {
    var key = datasource;

    var api_url = this.baseUrl + '/datasource/' + key + '/id/' + distinct;

    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {
        return response[response["datasource"]];
      }),
      catchError(this.handleError)
    );
  }

  public getArray(datasource, filter = null, all = true, max = null) {
    var key = datasource;

    var getAll = "/all";
    if (all == false)
      getAll = '';

    var api_url = this.baseUrl + '/datasource/' + key + getAll;
    if (max != null) {
      api_url += "/max_records/" + String(max)
    }

    if (filter != "") {
      api_url = api_url + "/filter/" + btoa(JSON.stringify(filter))
    }

    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {
        console.log(213, response["datasource"]);
        return response[response["datasource"]];
      }),
      catchError(this.handleError)
    );
  }

  public getArrayWithSort(datasource, filter = null, all = true, max = null, sort = null, columns = "") {
    var key = datasource;

    var getAll = "/all";
    if (all == false)
      getAll = '';

    var api_url = this.baseUrl + '/datasource/' + key + getAll;
    if (max != null) {
      api_url += "/max_records/" + String(max)
    }

    if (filter != "") {
      api_url = api_url + "/filter/" + btoa(JSON.stringify(filter))
    }

    if (sort != null) {
      api_url = api_url + "/sort/" + btoa(JSON.stringify(sort))
      console.log(495, sort)
    }

    if (columns.length > 0)
      this.httpOptions.headers = this.httpOptions.headers.append("x-body", columns);

    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {

        return response;
      }),
      catchError(this.handleError)
    );
  }

  public addToArray(id, key, value, pluralize = false) {
    var api_url = this.baseUrl + '/datasource/' + this.key + '/array' + '/id/' + id;
    console.log(351, api_url)
    if (pluralize == true)
      api_url += "/pluralize";

    this.last_post_body = {
      "key": key,
      "value": value
    }
    return this.http.post(api_url, {
      "key": key,
      "value": value
    }, this.httpOptions).pipe(
      map(response => {

        return response;
      }),
      catchError(this.handleError)
    );
  }

  public pullFromArray(id, key, value, pluralize = false) {
    var api_url = this.baseUrl + '/datasource/' + this.key + '/arrayrm' + '/id/' + id;

    if (pluralize == true)
      api_url += "/pluralize";

    this.last_post_body = {
      "key": key,
      "value": value
    }
    return this.http.post(api_url, {
      "key": key,
      "value": value
    }, this.httpOptions).pipe(
      map(response => {

        return response;
      }),
      catchError(this.handleError)
    );
  }

  public getAllUsersForAccount(key) {
    var key = key;

    var body = [
      "email",
      "first_name",
      "last_name"
    ]

    var api_url = this.baseUrl + '/datasource/' + key + "/owner/";

    this.last_post_body = body;
    return this.http.post(api_url, body, this.httpOptions).pipe(
      map(response => {
        return response["users"];
      }),
      catchError(this.handleError)
    );
  }

  dynamicButton(datasource: string, id: string, action: string, selectedRowData: object = null) {
    var key = datasource;
    var api_url = this.baseUrl + '/actions/datasource/' + key + '/action/' + action.toLowerCase() + '/id/' + id;

    if (selectedRowData == null) {
      return this.http.get(api_url, this.httpOptions).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
    } else {
      this.last_post_body = selectedRowData
      return this.http.post(api_url, selectedRowData, this.httpOptions).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
    }
  }

  genericAction(action, payload = null) {

    var api_url = this.baseUrl + '/actions/datasource/bounties/action/' + action.toLowerCase();

    console.log(688, payload);

    if (payload == null) {
      return this.http.get(api_url, this.httpOptions).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
    } else {
      this.last_post_body = payload;
      return this.http.post(api_url, payload, this.httpOptions).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
    }
  }

  rowSelected(datasource: string, id: string) {
    console.log("OKLOLO")

    var key = datasource;
    var api_url = this.baseUrl + '/actions/datasource/' + key + '/action/' + "selection" + '/id/' + id;

    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {
        console.log(504, response)
        return response;
      }),
      catchError(this.handleError)
    );

  }

  deleteSelected(datasource) {
    var api_url = this.baseUrl + '/actions/datasource/' + datasource + '/action/' + "deleteselected";

    console.log(546, api_url)
    return this.http.delete(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))

  }

  postAction(datasource, action: string, body = {}) {
    var key = datasource;
    var api_url = this.baseUrl + '/actions/datasource/' + key + '/action/' + action.toLowerCase();

    this.last_post_body = body;
    return this.http.post(api_url, body, this.httpOptions).pipe(
      map(response => {
        console.log(293, response);
        return response;
      }),
      catchError(this.handleError)
    );

    console.log(398)
  }

  headerButton(datasource: string, action: string, data: object = null) {
    var key = datasource;
    var api_url = this.baseUrl + '/actions/datasource/' + key + '/action/' + action.toLowerCase();

    if (data == null) {
      return this.http.get(api_url, this.httpOptions).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
    } else {
      this.last_post_body = data;
      return this.http.post(api_url, data, this.httpOptions).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
    }
  }

  updateDate(datasource: string, _id: string, _dateKey: string, _newDateValue: string) {
    console.log("Calling update calendar");
    var api_url = this.baseUrl + '/datasource/' + datasource + "/calendar"
    var pBody = {
      "_id": _id,
      "_dateValue": _newDateValue,
      "_dateKey": _dateKey,
    }
    this.last_post_body = pBody
    return this.http.post(api_url, pBody, this.httpOptions).pipe(map(response => {
      return response
    }))
  }

  addTeamUser(body: any) {
    var api_url = this.baseUrl + '/user'
    body.role = "administrator";
    if (body.change_password == "")
      body.change_password = false;
    delete body.cfpassword;
    this.last_post_body = body;
    return this.http.post(api_url, body, this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getKeysForSearchQuery(datasource: any, searchQuery: any) {
    var api_url = this.baseUrl + '/datasource/' + datasource + "/" + datasource + "/getkeys"
    this.last_post_body = searchQuery
    return this.http.post(api_url, searchQuery, this.httpOptions).pipe(map(response => {
      return response
    }))
  }

  addPaymentMethod(paymentMethod) {
    var api_url = this.baseUrl + '/stripe/method'
    this.last_post_body = {
      "paymentMethod": paymentMethod
    }
    return this.http.post(api_url, {
      "paymentMethod": paymentMethod
    }, this.httpOptions).pipe(map(response => {
      console.log(typeof response)
      return response
    }))
  }

  brandDataFromBountyId(bounty_id) {
    var api_url = this.baseUrl + '/actions/datasource/bounties/action/getbrandfrombounty'
    return this.http.post(api_url, {
      "bounty_id": bounty_id
    }, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))
  }

  completeBountyFromSpecialtyComponent(body) {
    var api_url = this.baseUrl + '/actions/datasource/bounties/action/complete/id/' + body["_id"]
    return this.http.post(api_url, body, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))
  }

  getNextSelectedItem(collectionName, id = 0) {
    var api_url = this.baseUrl + '/datasource/' + collectionName + '/action/nextselected'
    if (id != 0) {
      api_url = api_url + "/id/" + id;
    }

    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))
  }

  getPrevSelectedItem(collectionName, id = 0) {
    var api_url = this.baseUrl + '/datasource/' + collectionName + '/action/prevselected'
    if (id != 0) {
      api_url = api_url + "/id/" + id;
    }

    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))
  }

  getSelectedMergeFields(collectionName) {
    console.log(687, "Darasaz")
    var api_url = this.baseUrl + '/datasource/' + collectionName + '/action/mergefields'
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))
  }

  choose_template() {
    var api_url = this.baseUrl + '/datasource/templates'
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))

  }

  choose_template_pagination(page_endpoint) {
    var api_url = page_endpoint
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))

  }

  save_template(body) {
    var api_url = this.baseUrl + '/datasource/templates'
    return this.http.post(api_url, body, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))

  }

  linkGmail(emailFormInfo) {
    var url = this.baseUrl + '/integrations/gmail/authorization';

    return this.http.post(url, emailFormInfo, this.httpOptions).pipe(
      map(response => {

        return response;
      }),
      catchError(this.handleError)
    );

  }

  email_address(brand_id: any) {
    console.log(725, brand_id)
    console.log("Here....")
    var api_url = this.baseUrl + '/actions/datasource/gmails/action/getbrandgmailaccounts'
    console.log(80, api_url);

    return this.http.post(api_url, {
      "brand_id": brand_id
    }, this.httpOptions).pipe(map(response => {

      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  startin_percampaign(body: any) {
    console.log("Here startin_percampaign ....")
    var api_url = this.baseUrl + '/actions/datasource/outreach_emails/action/startsnipercampaign'
    console.log(80, api_url);
    return this.http.post(api_url, body, this.httpOptions).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))

  }

  sendSniperEmails(body) {

    var api_url = this.baseUrl + '/actions/datasource/outreach_emails/action/sendsniperemail';

    console.log(api_url);

    return this.http.post(api_url, body, this.httpOptions).pipe(map(response => {

      return response
    }), catchError(this.handleError))
  }

  getAnyList(collection, pages = 1000, endpoint = null, filter = null) {

    var api_url = this.baseUrl + `/datasource/${collection}/max_records/${pages}`

    if (endpoint != null) {
      api_url = endpoint
    }

    console.log(951, api_url)

    if (filter != null) {
      api_url = api_url + "/filter/" + btoa(JSON.stringify(filter))
    }

    console.log(955, api_url)

    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))
  }

  postAnyData(collection, body) {
    var api_url = this.baseUrl + `/datasource/${collection}`
    console.log(80, api_url);
    return this.http.post(api_url, body, this.httpOptions).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  updateAnyDataById(collection, body, _id) {
    var api_url = this.baseUrl + `/datasource/${collection}/id/${_id}`
    console.log(80, api_url);
    return this.http.put(api_url, body, this.httpOptions).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  bulkInsertNewData(collection, itemsAr) {

    var api_url = this.baseUrl + `/datasource/${collection}/bulk/`
    console.log(80, api_url, itemsAr);
    return this.http.post(api_url, itemsAr, this.httpOptions).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  getAnyDataById(collection, body, _id) {
    var api_url = this.baseUrl + `/datasource/${collection}/id/${_id}`
    console.log(80, api_url);
    return this.http.put(api_url, body, this.httpOptions).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  deleteAnyDataById(collection, _id) {
    var api_url = this.baseUrl + `/datasource/${collection}/id/${_id}`
    console.log(80, api_url);
    return this.http.delete(api_url).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  createSpreadsheet(title = "") {
    var api_url = this.baseUrl + `/google/sheets/createSpreadsheet`

    return this.http.post(api_url, {
      "title": title
    }, this.httpOptions).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  createDocument(title = "") {
    var api_url = this.baseUrl + `/google/sheets/createSpreadsheet`

    return this.http.post(api_url, {
      "title": title
    }, this.httpOptions).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  /* Version 2 only */
  selectAllRows(collection: string, options: object){
    console.log(1077, options);
    var api_url = this.baseUrl + `/datasource/${collection}/selectall`
    console.log(1079, api_url)

          this.httpOptions = {
        headers: new HttpHeaders({
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }),
        "withCredentials": true
      };


    return this.http.post(api_url, options, this.httpOptions).pipe(map(response => {
      {
        console.log(1092, response)
        return response
      }
    }), catchError(this.handleError))

  }


}