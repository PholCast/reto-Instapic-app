import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment, GalleryItem } from '../../interfaces/gallery-item.interface';

@Component({
  selector: 'app-image',
  imports: [],
  templateUrl: './image.component.html',
  styleUrl: './image.component.css'
})
export class ImageComponent {


  @Input('image')
  galleryItem!:GalleryItem;

  @Output()
  delete = new EventEmitter<string>();

  @Output()
  comments = new EventEmitter<Comment[]>();

  @Output()
  addComment = new EventEmitter<string>();


  onDelete(id:string){
    this.delete.emit(id);
  }

  onComment(comments:Comment[]){
    this.comments.emit(comments);
  }

  onAddComment(event:Event, id:string){
    const input = event.target as HTMLInputElement;
    if(!input.value){
      return;
    }
    this.addComment.emit(input.value);
    input.value = '';
  }

}
