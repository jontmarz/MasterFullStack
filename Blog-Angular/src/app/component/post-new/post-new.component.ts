import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { Global } from '../../services/global';

@Component({
  selector: 'ba-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.scss'],
  providers: [UserService, CategoryService, PostService]
})
export class PostNewComponent implements OnInit {

  public page_title: string;
  public identity;
  public token;
  public post: Post;
  public categories;
  public url;
  public status;
  public is_edit: boolean;
  public froala_options: Object = {
    placeholderText: 'Escribe tu biografía aquí',
    charCounterCount: true,
	language: 'es',
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
  };
  public afuConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png, .gif, .jepg',
    maxSize: '50',
    uploadAPI:  {
      url: Global.url + 'post/upload',
      headers: {
        'Authorization' : this._userService.getToken()
      }
    },
    theme: 'attachPin',
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Subir imagen'
  };
  public resetVar = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService
  ) {
    this.page_title = 'Crear una entrada';
    this.url = Global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.post = new Post(1, this.identity.sub, 1, '', '', null, null );
    this.getCategories();
  }

  getCategories() {
    this._categoryService.getCategories().subscribe(
      response => {
        if (response.status === 'success') {
          this.categories = response.categories;
          // console.log(this.categories);
        } else {
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  imageUpload(data) {
//     console.log(data);
    const image_data = JSON.parse(data.response);
    this.post.image = image_data.image;
  }

  onSubmit(form) {
    this._postService.create(this.token, this.post).subscribe(
      response => {
        if (response.status === 'success') {
          this.post = response.post;
          this.status = 'success';
          this._router.navigate(['/inicio']);
        } else {
          this.status = 'error';
        }
      }, error => {
        this.status = 'error';
        console.log(error);
      }
    );
  }
}
