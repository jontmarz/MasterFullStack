import { Component, OnInit, DoCheck  } from '@angular/core';
import { UserService } from './services/user.service';
import { CategoryService } from './services/category.service';
import { Global } from './services/global';
import { faTrademark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ba-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserService, CategoryService]
})
export class AppComponent implements OnInit, DoCheck {
  public title = 'blog-John';
  public identity;
  public token;
  public url;
  public copyright = faTrademark;
  public categories;

  constructor(
    public _userService: UserService,
    public _categoryService: CategoryService
  ) {
    this.loadUser();
    this.url = Global.url;
  }

  ngOnInit(): void {
    // console.log('app cargada');
    this.getCategories();
  }

  ngDoCheck(): void {
    this.loadUser();
  }

  loadUser() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  getCategories() {
    this._categoryService.getCategories().subscribe (
      response => {
        if (response.status === 'success') {
          this.categories = response.categories;
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
