<?php
namespace App\Helpers;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\DB;
use App\User;

class JwtAuth {

    public $key;

    public function _constructor()
    {
        $this->key = "Esta es una clave secreta que solo yo la conozco-79514676";
    }

    public function signup($email, $password, $getToken = null)
    {
        // verificar si existe el usuario
        $user = User::Where([
            'email'     => $email,
            'password'  => $password,
        ])->first();

        $signup = false;

        // comprobar si los datos son correctos
        if (is_object($user)) {
            $signup = true;
        }

        // Generar el token del usuario autenticado
        if ($signup) {
            $token = array(
                'sub'        => $user->id,
                'email'      => $user->email,
                'name'       => $user->name,
                'surname'    => $user->surname,
                'description'=> $user->description,
                'image'      => $user->image,
                'iat'        => time(),
                'exp'        => time() + (7*24*60*60)
            );

            $jwt = JWT::encode($token, $this->key, 'HS256');
            $decode = JWT::decode($jwt, $this->key, ['HS256']);

            // Devolver los datos decofificados y el token
            if (is_null($getToken)) {
                $data = $jwt;
            } else {
                $data = $decode;
            }
        } else {
            $data = array(
                'status'    => 'error',
                'message'   => 'login Incorrecto'
            );
        }

        return $data;
    }
}
