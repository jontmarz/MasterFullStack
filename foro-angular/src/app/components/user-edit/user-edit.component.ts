import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Global } from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

  public page_title: string;
  public user: User;
  public identity;
  public token;
  public status;
  public afuConfig;
  public url;
  public resetVar;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = 'Ajustes de Usuario';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = Global.url;

    this.afuConfig = {
      multiple: false,
      formatsAllowed: '.jpg, .jepg, .png, .gif',
      maxSize: '50',
      uploadAPI: {
        url: this.url + 'upload-avatar',
        headers: {
          'Authorization': this.token
        }
      },
      theme: 'attachPin',
      hideProgressBar: false,
      hideResetBtn: true,
      hideSelectBtn: false,
      replaceTexts: {
        selectFileBtn: 'Selecciona imagen',
        resetBtn: 'Borrar',
        uploadBtn: 'Subir Avatar',
        dragNDropBox: 'Drag N Drop',
        attachPinBtn: 'Sube archivo...',
        afterUploadMsg_success: 'Archivo subido satisfactoriamente !',
        afterUploadMsg_error: 'Falla en la subida !',
        sizeLimit: 'El tamaño excede el límite. Max 50Mb'
      }
    };
  }

  avatarUpload(data){
  //   const dataObj = JSON.parse(data.response);
  //   this.user.image = dataObj.user.image;
  //   console.log(this.user);
  }

  ngOnInit(): void {
  }

  onSubmit(form){
    this._userService.update(this.user).subscribe(
      response => {
        if (!response.user) {
          this.status = 'error';
        } else {
          this.status = 'success';
          localStorage.setItem('identity', JSON.stringify(this.user));
        }

      }, error => {
        this.status = 'error';
        console.log(error);
      }
    );
  }
}
