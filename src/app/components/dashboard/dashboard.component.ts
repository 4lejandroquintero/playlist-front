import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Playlist, PlaylistService, Song } from '../../services/playlist.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  playlists: Playlist[] = [];
  selectedPlaylist?: Playlist;
  searchTerm: string = '';

  constructor(private playlistService: PlaylistService, private router: Router) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  loadPlaylists() {
    this.playlistService.getAll().subscribe(data => {
      this.playlists = data;
    });
  }

  selectPlaylist(name: string) {
  if (this.selectedPlaylist?.nombre === name) {
    this.selectedPlaylist = undefined;
    return;
  }

  this.playlistService.getOne(name).subscribe(data => {
    this.selectedPlaylist = data;
  });
  }

  searchPlaylists() {
  if (!this.searchTerm.trim()) {
    this.loadPlaylists();
    return;
  }
  this.playlistService.searchByName(this.searchTerm).subscribe(data => {
    this.playlists = data;
  });
}

  createPlaylist(newPlaylist: Playlist) {
    this.playlistService.create(newPlaylist).subscribe({
      next: () => this.loadPlaylists(),
      error: (err) => {
        if (err.status === 400 || err.status === 409) {
          alert(err.error); // muestra el mensaje que envía el backend
        } else {
          alert('Error inesperado al crear la playlist');
        }
      }
    });
  }

  addSongToPlaylist(listName: string, song: Song) {
    this.playlistService.addSong(listName, song).subscribe({
      next: () => this.selectPlaylist(listName),
      error: (err) => {
        if (err.status === 409 || err.status === 404) {
          alert(err.error);
        } else {
          alert('Error inesperado al agregar la canción');
        }
      }
    });
  }

  deletePlaylist(name: string) {
    this.playlistService.delete(name).subscribe(() => {
      this.loadPlaylists();
      if (this.selectedPlaylist?.nombre === name) {
        this.selectedPlaylist = undefined;
      }
    });
  }

  logout() {
    // Token en localStorage:
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
