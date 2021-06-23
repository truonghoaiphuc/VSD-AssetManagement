import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, share, switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
// import { Token, User } from './interface';
import { SystemConstants } from '@core/common/System.Constants';
import { LoggedInUser } from '@core/domain/loggedin.user';
import { User } from './interface';
import { Token } from '@angular/compiler/src/ml_parser/lexer';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private user$ = new BehaviorSubject<User>(guest);
  private user$ : LoggedInUser;

  // private userReq$ = this.http.get<User>('/me');
  // private userReq$ = of(admin);

  constructor(private http: HttpClient, private token: TokenService) {
    // this.token
    //   .change()
    //   .pipe(
    //     switchMap(() => iif(() => this.check(), this.userReq$, of(guest))),
    //     map(user => Object.assign({}, guest, user))
    //   )
    //   .subscribe(user => this.user$.next(user));
    this.token
      .change()
      .pipe(
        switchMap(()=>iif(() => this.check())))
      .subscribe(user => this.user$ = user)
    console.log(this.user$);
  }

  check() {
    return this.token.valid();
  }

  login(email: string, password: string, rememberMe = false) {
    // return this.http
    //   .post<Token>('/auth/login', { email, password, remember_me: rememberMe })
    //   .pipe(
    //     tap(token => this.token.set(token)),
    //     map(() => this.check())
    //   );
    // const _token = { access_token: 'MW56YjMyOUAxNjMuY29tWm9uZ2Jpbg==', token_type: 'bearer' };
    // return of(_token).pipe(
    //   tap(token => this.token.set(token)),
    //   map(() => this.check())
    // );

    const body = 'userName=' + encodeURIComponent(email) +
      '&password=' + encodeURIComponent(password) +
      '&grant_type=password';
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post<any>(SystemConstants.BASE_API + '/api/oauth/token', body, {headers: headers})
      .pipe(
        tap(token=>{
          this.token.set(token);
          console.log(token);
        }),
        map(()=>this.check())
      );
  }

  logout() {
    // return this.http.post('/auth/logout', {}).pipe(
    //   tap(() => this.token.clear()),
    //   map(() => !this.check())
    // );
    return of({}).pipe(
      tap(() => this.token.clear()),
      map(() => !this.check())
    );
  }

  user() {
    let user: LoggedInUser;
    if (this.check()) {
      var userData = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
      user = new LoggedInUser(userData.access_token,
        userData.username,
        userData.fullName,
        userData.email,
        userData.avatar, userData.roles, userData.permissions);
    }
    else {
      user = null;
    }
    return user;
  }
}
