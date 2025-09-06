import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Song {
  titulo: string;
  artista: string;
  album: string;
  anno: string;
  genero: string;
}

export interface Playlist {
  nombre: string;
  descripcion: string;
  canciones: Song[];
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private baseUrl = 'http://localhost:8080/lists';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeader();
  }

  getAll(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  getOne(name: string): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.baseUrl}/${name}`, { headers: this.getHeaders() });
  }

  create(playlist: Playlist): Observable<Playlist> {
    return this.http.post<Playlist>(this.baseUrl, playlist, { headers: this.getHeaders() });
  }

  addSong(listName: string, song: Song): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.baseUrl}/${listName}/songs`, song, { headers: this.getHeaders() });
  }

  delete(name: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${name}`, { headers: this.getHeaders() });
  }

  searchByName(name: string): Observable<Playlist[]> {
  return this.http.get<Playlist[]>(`${this.baseUrl}/search?name=${name}`, { headers: this.getHeaders() });
  }
}
