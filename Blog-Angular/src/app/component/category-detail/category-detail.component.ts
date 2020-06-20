import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { Global } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'ba-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss'],
  providers: [CategoryService, UserService, PostService]
})
export class CategoryDetailComponent implements OnInit {

  public page_title: string;
  public category: Category;
  public posts: any;
  public url: string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _categoryService: CategoryService,
    private _userService : UserService,
    private _postService: PostService
  ) {
    this.url = Global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getPostsByCategory();
  }

  getPostsByCategory() {
    this._route.params.subscribe(params => {
      const id = +params.id;

      this._categoryService.getCategory(id).subscribe (
        response => {
          if (response.status === 'success') {
            this.category = response.category;
            // console.log(this.category);

            this._categoryService.getPosts(id).subscribe (
              response => {
                 if (response.status === 'success') {
                  this.posts = response.post;
                  // console.log(this.posts);
                } else {
                  this._router.navigate(['/inicio']);
                }
              }, error => {
                console.log(error);
              }
          );
          } else {
            this._router.navigate(['/inicio']);
          }
        }, error => {
          console.log(error);
        }
      );
    });
  }

  deletePost(id) {
    this._postService.delete(this.token, id).subscribe(
      response => {
        this.getPostsByCategory();
      },
      error => {
        console.log(error);
      }
    );
  }
}
