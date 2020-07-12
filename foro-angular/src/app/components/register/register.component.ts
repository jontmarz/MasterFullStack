import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {

  public page_title: string;
  public user: User;
  public status: any;

  constructor(
    private _userService: UserService
  ) {
    this.page_title = 'Registrate';
    this.user = new User('', '', '', '', '', '', 'Role_User');
  }

  ngOnInit(): void {
  }

  onSubmit(form){
    // console.log(this.user);
    this._userService.register(this.user).subscribe(
      response => {
        if (response.user && response.user._id) {
          this.status = 'success';
          form.reset();
        } else {
          this.status = 'error';
        }
      }, error => {
        console.log(error);
      }
    );
  }
}
