import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { Global } from '../../services/global';

@Component({
  selector: 'ba-post-edit',
  templateUrl: '../post-new/post-new.component.html',
  styleUrls: ['./post-edit.component.scss'],
  providers: [UserService, CategoryService, PostService]
})
export class PostEditComponent implements OnInit {

  public page_title: string;
  public identity;
  public token;
  public post: Post;
  public categories;
  public url;
  public status;
  public is_edit: boolean;
  public froala_options: Object = {
    placeholderText: 'Escribe tu biografía aquí',
    charCounterCount: true,
    language: 'es',
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
  };
  public afuConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png,.gif,.jepg',
    maxSize: '50',
    uploadAPI:  {
      url: Global.url + 'post/upload',
      headers: {
        'Content-Type' : 'text/plain;charset=UTF-8',
        'Authorization' : this._userService.getToken()
      }
    },
    theme: 'attachPin',
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Subir imagen'
  };
  public resetVar = true;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService
  ) {
    this.page_title = "Editar entrada";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.is_edit = true;
    this.url = Global.url;
  }

  ngOnInit(): void {
    this.post = new Post(1, this.identity.sub, 1, '', '', 'null', 'null');
    this.getCategories();
    this.getPost();
  }

  getCategories() {
    this._categoryService.getCategories().subscribe(
      response => {
        if (response.status === 'success') {
          this.categories = response.categories;
          console.log(this.categories);
        } else {

        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getPost() {
    // Sacar el ide del post de la url
    this._route.params.subscribe(params => {
      const id = +params.id;

      // Petición ajac para sacar los datos del post
      this._postService.getPost(id).subscribe(
        response => {
          if (response.status === 'success') {
            this.post = response.post;

            if (this.post.user_id !== this.identity.sub) {
              this._router.navigate(['/inicio']);
            }
          } else {
          }
        },
        error => {
          console.log(error);
          this._router.navigate(['/inicio']);
        }
      );
    });
  }

  imageUpload(data) {
    const image_data = JSON.parse(data.response);
    this.post.image = image_data.image;
  }

  onSubmit(form) {
    this._postService.update(this.token, this.post, this.post.id).subscribe(
      response => {
        if (response.status === 'success') {
          this.status = 'success';

          // redirigir a la entrada
          this._router.navigate(['/entrada', this.post.id]);
        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
      }
    );
  }
}
