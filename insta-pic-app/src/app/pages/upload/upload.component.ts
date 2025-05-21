import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { GalleryService } from '../../shared/services/gallery.service';

@Component({
  selector: 'app-upload',
  imports: [],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {

  galleryService = inject(GalleryService);



  onFileSelected(event:Event){
    /*Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });*/
    let inputFile = event.target as HTMLInputElement;
    if(!inputFile.files || inputFile.files.length <= 0){
      return;
    }
    const file:File = inputFile.files[0];
    const fileName = uuidv4();
    this.galleryService.upload(file, fileName);
    //Swal.close();
    //Swal.fire('Error', 'Ocurrió un error al cargar los datos', 'error');

  }

}
