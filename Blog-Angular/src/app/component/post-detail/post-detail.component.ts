import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { Global } from '../../services/global';

@Component({
  selector: 'ba-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  providers: [PostService]
})
export class PostDetailComponent implements OnInit {

  public post: Post;
  public url;

  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.url = Global.url;
  }

  ngOnInit(): void {
    this.getPost();
    // console.log(this.post);
  }

  getPost() {
    // Sacar el ide del post de la url
    this._route.params.subscribe(params => {
      const id = +params.id;
      // console.log(id);

      // Petición ajac para sacar los datos del post
      this._postService.getPost(id).subscribe(
        response => {
          if (response.status === 'success') {
            this.post = response.post;
            // console.log(this.post);
          } else {
            this._router.navigate(['/inicio']);
          }
        },
        error => {
          console.log(error);
          this._router.navigate(['/inicio']);
        }
      );
    });
  }
}
