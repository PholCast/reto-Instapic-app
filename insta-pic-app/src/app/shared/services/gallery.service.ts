import { inject, Injectable, signal } from '@angular/core';
import { GalleryItem } from '../interfaces/gallery-item.interface';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { TokenService } from './token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  tokenService = inject(TokenService);
  http = inject(HttpClient)

  private supabase: SupabaseClient;

  private BUCKET_NAME = 'instapic';
  private URL_BASE_STORAGE = 'https://evrfaebpcyqokmzzjiyo.supabase.co/storage/v1/object/public';
  private URL_BASE_SERVICE = 'http://localhost:3000/api/v1/photo';

  constructor() {
    this.supabase = createClient(
      'url',
      'secret'
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

  upload(file:File, fileName:string){
    const user = this.tokenService.decodeToken();
    if(user){
      this.supabase.storage
      .from('instapic')
      .upload( `${user.username}/${fileName}`, file)
      .then(response=>{
        if(response.data){
          const url = `${this.URL_BASE_STORAGE}/${this.BUCKET_NAME}/${user.username}/${fileName}`;
          const body = {
            url,
            id:user.userId
          }
          this.http.post(this.URL_BASE_SERVICE, body, this.getHeaders(this.tokenService.getToken()!)).subscribe(response=>{
            this.http.get<any[]>(`${this.URL_BASE_SERVICE}/${user.userId}`).subscribe(response=>{
              const gallery = response.map(item=>{
                return {
                  id:item.id,
                  url:item.url,
                  username: item.user.username,
                  comments:[]
                };
              });
              this._gallery.set(gallery)
            })
          })
        }
      })
    }

  }

  deleteById(id:string){
    this._gallery.update(items=>items.filter(item => item.id !== id))
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
      Authorization: `Bearer ${token}`
    })};
  }

}
