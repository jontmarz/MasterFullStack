import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { Global } from '../../services/global';

@Component({
  selector: 'ba-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  providers: [PostService, UserService]
})
export class InicioComponent implements OnInit {

  public page_title: string;
  public url;
  public posts: Array<Post>;
  public identity;
  public token;
  public is_edit: boolean;
  public user: any;

  constructor(
    private _postService: PostService,
    private _userService: UserService
  ) {
    this.page_title = 'Incio';
    this.url = Global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.is_edit = false;
  }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this._postService.getPosts().subscribe(
      response => {
        if (response.status === 'success') {
          this.posts = response.posts;
          // console.log(this.posts);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  deletePost(id) {
    this._postService.delete(this.token, id).subscribe(
      response => {
        this.getPosts();
      },
      error => {
        console.log(error);
      }
    );
  }
}
