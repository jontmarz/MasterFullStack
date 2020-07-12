import { Component, OnInit, DoCheck  } from '@angular/core';
import { UserService } from './services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from './services/global';
import { faTrademark } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {

  public title = 'foro-angular';
  public copyright = faTrademark;
  public foro = faUsers;
  public identity;
  public token;
  public url;
  public load: boolean;
  public search;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = Global.url;
    this.load = false;
  }

  ngDoCheck(): void {
    this.identity = this._userService.getIdentity();
  }

  ngOnInit(): void {
    this.loading();
    // console.log(this.identity);
    // console.log(this.token);
  }

  logOut(){
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/inicio']);
  }

  loading() {
    setTimeout(() => {
      this.load = true;
    }, 5000);
  }

  goSearch(){
    this._router.navigate(['/buscar', this.search]);
    this.search = '';
    console.log(this.search);
  }
}
