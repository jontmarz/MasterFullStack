<?php

namespace App\Http\Controllers;

use App\Helpers\JwtAuth;
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
        // Comprobar el usuario identificado
        $token = $request->header('authorization');
        $jwtAuth = new \JwtAuth;
        $checkToken = $jwtAuth->checkToken($token);

        // Si enl usuario es identificado
        if ($checkToken && !empty($this->params_array)) {
            $user = $jwtAuth->checkToken($token, true); //Tomar datos del usuario

            // Validar datos
            $validate = \Validator::make($this->params_array, [
                'name'      => 'required|alpha',
                'surname'   => 'required|alpha',
                'email'     => 'required|email|unique:users'.$user->sub
            ]);
            // Omitir campo que no se actualizarán
            unset($this->params_array['id']);
            unset($this->params_array['role']);
            unset($this->params_array['password']);
            unset($this->params_array['create_at']);
            unset($this->params_array['remember_token']);

            $userUpdate = User::where('id', $user->sub)->update($this->params_array);

            // Resultado
            $data = array(
                'status'    => 'success',
                'code'      => 200,
                'user'      => $user,
                'change'    => $this->params_array
            );
        } else {
            $data = array(
                'status'    => 'error',
                'code'      => 400,
                'message'   => 'Usuario no identificado'
            );
        }

        return response()->json($data, $data['code']);
    }

    public function upload(Request $request)
    {
        // Recoger datos de la petición
        $image = $request->file('file0');

        // Validar imagen
        $validate = \Validator::make($request->all(), [
            'file0' => 'required|image|mimes:tiff,png,gif,jpg,jepg|max:2048'
        ]);

        // Si no se valida la imagen
        if (!$image || $validate->fails()) {
            $data = array(
                'status'    => 'error',
                'code'      => 404,
                'message'   => 'Error al subir la imagen'
            );
        } else {
            $imageName = time().$image->getClientOriginalName();
            \Storage::disk('users')->put($imageName, \File::get($image));

            $data = array(
                'status'    => 'success',
                'code'      => 200,
                'image'     => $imageName
            );
        }

        return response()->json($data, $data['code']);
    }

    public function getImage($filename)
    {
        $file = \Storage::disk('users')->get($filename);
        return new Response($file, 200);
    }

    public function detailsProfile($id)
    {
        $user = User::find($id);

        if (is_object($user)) {
            $data = array(
                'status'    => 'success',
                'code'      => 200,
                'user'      => $user
            );
        } else {
            $data = array(
                'status'    => 'error',
                'code'      => 404,
                'message'   => 'El usuario no existe'
            );
        }

        return response()->json($data, $data['code']);
    }
}
