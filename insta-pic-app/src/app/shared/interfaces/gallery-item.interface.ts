export interface GalleryItem{
  id:string;
  url:string,
  username?:string,
  comments:Comment[];
}

export interface Comment{
  id?:string;
  userId?:string;
  message:string;
}
