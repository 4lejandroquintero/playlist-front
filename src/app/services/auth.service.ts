import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    });

    return this.http.get(`${this.baseUrl}/lists`, { headers }).pipe(
      tap(() => {
        // Se guardan las credenciales en localStorage
        localStorage.setItem('auth', btoa(`${username}:${password}`));
      }),
      map(() => true), 
      catchError(() => of(false))
    );
  }

  logout() {
    localStorage.removeItem('auth');
  }

  getAuthHeader(): HttpHeaders {
    const auth = localStorage.getItem('auth');
    return auth ? new HttpHeaders({ 'Authorization': 'Basic ' + auth }) : new HttpHeaders();
  }
}
