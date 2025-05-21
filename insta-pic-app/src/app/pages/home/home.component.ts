import { Component, inject, OnInit, signal } from '@angular/core';
import { TokenService } from '../../shared/services/token.service';
import { Comment, GalleryItem } from '../../shared/interfaces/gallery-item.interface';
import { GalleryService } from '../../shared/services/gallery.service';
import { ImageComponent } from '../../shared/controls/image/image.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [ImageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  tokenService = inject(TokenService);
  galleryService = inject(GalleryService);

  username = '';

  gallery = signal<GalleryItem[]>([]);

  ngOnInit(): void {
    this.username = this.tokenService.decodeToken()?.username||'Bienvenido!';
    this.gallery = this.galleryService.getByUser(this.username);
  }

  
  onDeleteImage(id:string){
    Swal.fire({
      text: "¿Está seguro de eliminar la imagen seleccionada?",
      icon: "warning",
      iconColor: "#219ebc",
      showCancelButton: true,
      confirmButtonColor: "#023047",
      cancelButtonColor: "#d00000",
      confirmButtonText: "Si",
      cancelButtonText:"No"
    }).then((result) => {
      if (result.isConfirmed) {
       
        this.galleryService.deleteById(id).subscribe({
          next: () => {
            this.gallery.update(items => items.filter(item => item.id !== id));
            Swal.fire('Eliminada!', 'La imagen ha sido eliminada.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar la imagen:', err);
            Swal.fire('Error', 'No se pudo eliminar la imagen.', 'error');
          }
        });
      }
    });
  }

  onComments(comments:Comment[]){
    let htmlContent = 'Aún no hay comentarios, se el primero!';
    if(comments.length>0){
      htmlContent = '<div class="read-comments">';
      comments.forEach(comment => {
        htmlContent += `<p><strong>${comment.userId||''}</strong> - ${comment.message}</p>`;
      });
      htmlContent += '</div>';
    }
    Swal.fire({
      html: htmlContent
    })
  }

  onAddComment(comment:string, id:string){
    this.galleryService.addCommentById(comment, id);
  }

}
