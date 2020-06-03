<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\User;


class UserController extends Controller
{
    public $params;
    public $params_array;

    public function __construct(Request $request)
    {
        // Recoger datos por post
        $json = $request->input('json', null);

        $this->params = json_decode($json); // Método que codifica en objeto
        $this->params_array = json_decode($json, true); //Método que codifica en array
    }

    public function register(Request $request)
    {
        // Validación de datos
        if (!empty($this->params) && !empty($this->params_array)) {
            $this->params_array = array_map('trim', $this->params_array); // Limpia los datos

            // Validar datos del formulario
            $validate = \Validator::make($this->params_array, [
                'name'      => 'required|alpha',
                'surname'   => 'required|alpha',
                'email'     => 'required|email|unique:users',
                'password'  => 'required'
            ]);

            // Si la validación falla
            if ($validate->fails()) {
                $data = array(
                    'status'    => 'error',
                    'code'      => 404,
                    'message'   => 'El usuario ya está registrado',
                    'errors'    =>  $validate->errors()
                );
            } else {
                $pwd = hash('sha256', $this->params->password); // Cifrar contraseña

                // Crear usuario
                $user = new User();
                $user->name = $this->params_array['name'];
                $user->surname = $this->params_array['surname'];
                $user->email = $this->params_array['email'];
                $user->password = $pwd;
                $user->role = 'ROLE_USER';

                $user->save(); // Guardar usuario en DB

                $data = array(
                    'status'    => 'success',
                    'code'      => 200,
                    'message'   => 'El usuario se ha creado satisfactoriamente',
                    'user'      => $user
                );
            }
        } else {
            $data = array(
                'status'    => 'error',
                'code'      => 404,
                'message'   => 'Los datos enviados no son correctos'
            );
        }

        return response()->json($data, $data['code']);
    }

    public function login(Request $request)
    {
        $jwtAuth = new \JwtAuth();

        // Validar datos
        $validate = \Validator::make($this->params_array, [
            'email'     => 'required|email',
            'password'  => 'required'
        ]);

        // Si la validación falla
        if ($validate->fails()) {
            $signup = array(
                'status'    => 'error',
                'code'      => 404,
                'message'   => 'El usuario se no ha logrado identificar',
                'errors'    => $validate->errors()
            );
        } else {
            // Cifar contraseña
            $pwd = hash('sha256', $this->params->password);

            // Devolver token o datos
            $signup = $jwtAuth->signup($this->params->email, $pwd);

            if (!empty($this->params->getToken)) {
                $signup = $jwtAuth->signup($this->params->email, $pwd, true);
            }
        }

        return response()->json($signup, 200);
    }

    public function update(Request $request)
    {
        return "Acción de Actualizar Usuario ";
    }

    public function destroy(Request $request)
    {
        return "Acción de eliminar Usuario";
    }
}
