import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@core';
import { ToastrService } from 'ngx-toastr';
import { SystemConstants } from '@core/common/System.Constants';
import { MessageContstants } from '@core/common/message.constants';


@Injectable()
export class DataService {
  private headers = new HttpHeaders();

  constructor(private _http: HttpClient,
    private _authenService: AuthService,
    private _notificationService: ToastrService) {
      this.headers = this.headers.set('Content-Type', 'application/json');
      this.headers = this.headers.set("Authorization", "Bearer " + _authenService.user().access_token);
  }

  get(uri: string) {

    return this._http.get(SystemConstants.BASE_API + uri, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }
  post(uri: string, data?: any) {

    return this._http.post(SystemConstants.BASE_API + uri, data, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }
  put(uri: string, data?: any) {

    return this._http.put(SystemConstants.BASE_API + uri, data, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }
  delete(uri: string, key: string, id: string) {

    return this._http.delete(SystemConstants.BASE_API + uri + "/?" + key + "=" + id, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }
  deleteWithMultiParams(uri: string, params) {
    var paramStr: string = '';
    for (let param in params) {
      paramStr += param + "=" + params[param] + '&';
    }
    return this._http.delete(SystemConstants.BASE_API + uri + "/?" + paramStr, { headers: this.headers })
      .pipe(catchError(this.handleError));

  }
  postFile(uri: string, data?: any) {
    let newHeader = new HttpHeaders();
    newHeader.set("Authorization", "Bearer " + this._authenService.user().access_token);
    return this._http.post(SystemConstants.BASE_API + uri, data, { headers: newHeader })
      .pipe(catchError(this.handleError));
  }
  public handleError(error: any) {
    if (error.status == 401) {
      localStorage.removeItem(SystemConstants.CURRENT_USER);
      this._notificationService.error(MessageContstants.LOGIN_AGAIN_MSG,"Lỗi");
      // this._utilityService.navigateToLogin();
    }
    else if (error.status == 403) {
      localStorage.removeItem(SystemConstants.CURRENT_USER);
      this._notificationService.error(MessageContstants.FORBIDDEN,"Lỗi");
      // this._utilityService.navigateToLogin();
    }
    else {
      let errMsg = JSON.parse(error._body).Message;
      this._notificationService.error(errMsg);

      return Observable.throw(errMsg);
    }


  }
}
