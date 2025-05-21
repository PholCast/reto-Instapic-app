import { inject, Injectable, signal } from '@angular/core';
import { GalleryItem } from '../interfaces/gallery-item.interface';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { TokenService } from './token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  tokenService = inject(TokenService);
  http = inject(HttpClient)

  private supabase: SupabaseClient;

  private BUCKET_NAME = 'instapic';
  private URL_BASE_STORAGE = '';
  private URL_BASE_SERVICE = 'http://localhost:3000/api/v1/photo';

  constructor() {
    this.supabase = createClient(
      '',
      ''
    );
  }

  private _gallery = signal<GalleryItem[]>(
    [{
      id:'1',
      url:'./assets/gallery0.jpg',
      comments:[]
    },
    {
      id:'2',
      url:'./assets/gallery1.jpg',
      comments:[]
    },
    {
      id:'3',
      url:'./assets/gallery2.webp',
      comments:[]
    },
    {
      id:'4',
      url:'./assets/gallery3.jpeg',
      comments:[]
    },
    {
      id:'5',
      url:'./assets/gallery4.jpg',
      comments:[]
    },
    {
      id:'6',
      url:'./assets/gallery6.jpg',
      comments:[]
    },
    {
      id:'7',
      url:'./assets/gallery7.jpg',
      comments:[]
    },
    {
      id:'8',
      url:'./assets/gallery8.webp',
      comments:[]
    },
    {
      id:'9',
      url:'./assets/gallery9.avif',
      comments:[]
    }]
  )

  getByUser(username:string){

    return this._gallery;

  }

  upload(file: File, fileName: string) {
  const user = this.tokenService.decodeToken();
  if (!user || this.tokenService.isTokenExpired()) {
    console.error('usuario no autenticado o el token ha expirado');
    return;
  }

  this.uploadFileToStorage(file, fileName, user)
    .then(response => {
      if (response.error) {
        console.error('Upload error:', response.error.message);
        return;
      }

      const url = this.buildFileUrl(user.username, fileName);
      const body = this.buildRequestBody(url, user.id);

      this.sendPostRequest(body, user.id);
    })
    .catch(err => console.error('Upload error:', err));
}


private uploadFileToStorage(file: File, fileName: string, user:JwtPayload) {
  const path = `${user.username}/${fileName}`;
  return this.supabase.storage.from('instapic').upload(path, file);
}

private buildFileUrl(username: string, fileName: string) {
  return `${this.URL_BASE_STORAGE}/${this.BUCKET_NAME}/${username}/${fileName}`;
}

private buildRequestBody(url: string, userId: string) {
  return { url, userId };
}

private sendPostRequest(body: { url: string; userId: string }, userId: string) {
  const headers = this.getHeaders(this.tokenService.getToken()!);

  this.http.post(this.URL_BASE_SERVICE, body, headers).subscribe({
    next: (response) => {
      console.log('POST:', response);
      this.fetchUpdatedGallery(userId);
    },
    error: (err) => console.error('POST error:', err)
  });
}

private fetchUpdatedGallery(userId: string) {
  const headers = this.getHeaders(this.tokenService.getToken()!);

  this.http.get<any[]>(`${this.URL_BASE_SERVICE}/${userId}`, headers).subscribe({
    next: (response) => {
      console.log('GET:', response);
      const gallery = response.map(item => ({
        id: item["id"],
        url: item.url,
        username: item.user.username,
        comments: []
      }));
      this._gallery.set(gallery);
    },
    error: (err) => console.error('GET error:', err)
  });
}



  deleteById(photoId: string){ 
    const token = this.tokenService.getToken();
    const user = this.tokenService.decodeToken(); 

    if (!token || this.tokenService.isTokenExpired() || !user || !user.id) {
      return throwError(() => new Error('Autenticación requerida o token expirado.'));
    }
    const deleteUrl = `${this.URL_BASE_SERVICE}/${photoId}`;

    return this.http.delete<void>(deleteUrl, this.getHeaders(token)).pipe(
      catchError(error => {
        console.error(`Error al eliminar la foto con ID ${photoId}:`, error);
        return throwError(() => new Error('Falló la eliminación de la foto.'));
      })
    );
  }


  

  addCommentById(comment: string, id: string) {
    this._gallery.update(items =>
      items.map(item => {
        if (item.id === id) {
          return {
            ...item,
            comments: [...item.comments, {message:comment}]
          };
        }
        return item;
      })
    );
  }

  private getHeaders(token:string){
    return {headers: new HttpHeaders({  
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    })};
  }

}
