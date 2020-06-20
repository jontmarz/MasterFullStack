import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'ba-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  public page_title: string;
  public user: User;
  public status: string;

  constructor(
    private _userService: UserService,
  ) {
    this.page_title = 'Regístrate';
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
  }

  ngOnInit(): void {
    console.log('Componente de Registro');
    console.log(this._userService.test());
  }

  // Evento del formulario de registro
  onSubmit(form) {
    // toma los datos de registro  dentro del evento register y los envía al evento suscriber
    this._userService.register(this.user).subscribe (

      // El evento response es una llamada de acción de tipo objeto JSON
      response => {
        // condicional que aplica si la respuesta del response es success
        if (response.status === 'success') { // la respuesta es true, entonces ejecuta el response
          this.status = response.status;
          form.reset(); // Limpia el formulario
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(error as any);
        this.status = 'error';
      }
    );
  }
}
