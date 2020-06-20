import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { Global } from '../../services/global';

@Component({
  selector: 'ba-profile',
  templateUrl: '../inicio/inicio.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [PostService, UserService]
})
export class ProfileComponent implements OnInit {

  public page_title: string;
  public url;
  public posts: Array<Post>;
  public user: Post;
  public identity;
  public token;
  public is_edit: boolean;

  constructor(
    private _postService: PostService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.page_title = '';
    this.url = Global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.is_edit = true;
  }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    // Sacar el ide del post de la url
    this._route.params.subscribe(params => {
      const userId = +params.id;
      this.getUser(userId);
      this.getPosts(userId);
    });
  }

  getPosts(userId) {
    this._userService.getPost(userId).subscribe(
      response => {
        if (response.status === 'success') {
          this.posts = response.post;
          // console.log(this.posts);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getUser(userId) {
    this._userService.getUser(userId).subscribe(
      response => {
        if (response.status === 'success') {
          this.user = response.user;
          // console.log(this.user);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  deletePost(id) {
    // console.log('delete en profile');
    this._postService.delete(this.token, id).subscribe(
      response => {
        this.getProfile();
      },
      error => {
        console.log(error);
      }
    );
  }
}
