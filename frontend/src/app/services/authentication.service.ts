import { User } from './../../../../api/src/user/models/user.interface';
import { map } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface LoginForm {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(loginForm: LoginForm) {

    return this.http.post<any>('/api/users/login', {
      email: loginForm.email, password: loginForm.password
    }).pipe(
      map((token) => {
        localStorage.setItem('blog-token', token.access_token);
        return token;
      })
    );
  }

  register(user: User) {
    return this.http.post<any>('/api/users', user);
  }
}
