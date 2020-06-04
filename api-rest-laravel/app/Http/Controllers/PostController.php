<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use PHPUnit\Framework\Exception;
Use App\Post;
use App\Helpers\JwtAuth;

class PostController extends Controller
{
    public $params;
    public $params_array;

    public function __construct(Request $request)
    {
        $this->middleware('api_auth', ['except'=>['index',
                                                  'show',
                                                  'getImage',
                                                  'getPostByCategory',
                                                  'getPostByUser'
        ]]);

        // Recoger datos por post
        $json = $request->input('json', null);
        $this->params = json_decode($json);
        $this->params_array = json_decode($json, true);
    }

    public function getIdentity($request)
    {
        // Comprobar identidad del usuario
        $jwtAuth = new JwtAuth();
        $token = $request->header('Authorization', null);
        $user = $jwtAuth->checkToken($token, true);

        return $user;
    }

    public function index()
    {
        $posts = Post::all()->load('category');

        $data = [
            'status'    => 'success',
            'code'      => 200,
            'posts'     => $posts
        ];

        return response()->json($data, $data['code']);
    }

    public function show($id)
    {
        $post = Post::find($id)->load('category')
                               ->load('user');

        if (is_object($post)) {
            $data = [
                'status'    => 'success',
                'code'      => 200,
                'post'      => $post
            ];
        } else {
            $data = [
                'status'    => 'error',
                'code'      => 404,
                'message'   => 'No existe la entrada'
            ];
        }

        return response()->json($data, $data['code']);
    }

    public function store(Request $request)
    {
        // Si hay datos recibidos desde el método POST
        if (!empty($this->params_array)) {
            // Conseguir el usuario autenticado
            $user = $this->getIdentity($request);

            // Validar los datos
            $validate = \Validator::make($this->params_array, [
                'title'         => 'required',
                'content'       => 'required',
                'category_id'   => 'required',
                'image'         => 'required',
            ]);

            if ($validate->fails()) {
                $data = [
                    'code'      => 404,
                    'status'    => 'error',
                    'message'   => 'No se ha guardado el post, faltan datos'
                ];
            } else {
                // Guardar el post
                $post = new Post();
                $post->user_id = $user->sub;
                $post->category_id = $this->params->category_id;
                $post->title = $this->params->title;
                $post->content = $this->params->content;
                $post->image = $this->params->image;
                $post->save();

                $data = [
                    'code'   => 200,
                    'status' => 'success',
                    'post'   => $post
                ];
            }

        } else {
            $data = [
                'code'      => 404,
                'status'    => 'error',
                'message'   => 'No se ha guardado el post, faltan datos'
            ];
        }

        // Devolver la respuesta
        return response()->json($data, $data['code']);
    }

    public function update($id, Request $request)
    {
        // Datos para devolver
        $data = [
            'code'      => 400,
            'status'    => 'error',
            'message'   => 'Datos enviados incorrectamente'
        ];

        if (!empty($this->params_array)) {
            // Validar datos
            $validate = \Validator::make($this->params_array, [
                'title'         => 'required',
                'content'       => 'required',
                'category_id'   => 'required'
            ]);

            if ($validate ->fails()) {
                $data['errors'] = $validate ->errors();
                return response() ->json($data, $data['code']);
            }

            // Omitir lo que no se va a actualizar
            unset($this->params_array['id']);
            unset($this->params_array['user_id']);
            unset($this->params_array['created_at']);
            unset($this->params_array['updated_at']);
            unset($this->params_array['user']);

            // Conseguir el usuario identificado
            $user = $this->getIdentity($request);

            // Buscar el registro a actualizar
            $post = Post::where('id', $id)
                        ->where('user_id', $user->sub)
                        ->first();

            if (!empty($post) && is_object($post)) {
                // Actualizar el registro
                $post ->update($this->params_array);

                // Devolver respuesta
                $data = [
                        'code'      => 200,
                    'status'    => 'success',
                    'post'      => $post,
                    'change'    => $this->params_array
                ];
            }
        }

        return response() ->json($data, $data['code']);
    }

    public function destroy($id, Request $request)
    {
        // Recoger datos por post
        $user = $this->getIdentity($request);

        // Conseguir entrada
        $post = Post::where('id', $id)
                    ->where('user_id', $user->sub)
                    ->first();

        // Si la entrada tiene datos
        if (!empty($post)) {
            // Eliminar entrada
            $post->delete();

            // Devolver respuesta
            $data = [
                'status'    => 'success',
                'code'      => 200,
                'post'      => $post
            ];
        } else {
            $data = [
                'status'    => 'error',
                'code'      => 404,
                'message'   => 'Registro no existe'
            ];
        }

        return response()->json($data, $data['code']);
    }

    public function upload(Request $request)
    {
        // Recoger por post
        $image = $request->file('file0');

        // Validar imagen
        $validate = \Validator::make($request->all(), [
            'file0' => 'required|image|mimes:jpg,png,jepg,gif'
        ]);

        // Guardar imagen
        if (!$image || $validate->fails()) {
            $data = [
                'status'    => 'error',
                'code'      => 404,
                'message'   => 'Error al subir la imagen'
            ];
        } else {
            $image_name = time().$image->getClientOriginalName();
            \Storage::disk('images')->put($image_name, \File::get($image));

            $data = [
                'status'    => 'success',
                'code'      => 200,
                'image'     => $image_name
            ];
        }

        return response()->json($data, $data['code']);
    }

    public function getImage($filename)
    {
        // comprobar si existe el archivo
        $isset = \Storage::disk('images')->exists($filename);

        // Si el archivo existe
        if ($isset) {
            $file = \Storage::disk('images')->get($filename);

            // Devolver imagen
            return new Response($file, 200);
        } else {
            // Devolver error
            $data = [
                'status'    => 'error',
                'code'      => 200,
                'message'   => 'La imagen no existe'
            ];
        }

        return response()->json($data, $data['code']);
    }

    public function getPostbyCategory($id)
    {
        $post = Post::where('category_id', $id)->get();

        $data =[
            'status'    => 'success',
            'code'      => 200,
            'post'      => $post
        ];
        return response()->json($data, $data['code']);
    }

    public function getPostbyUser($id)
    {
        $post = Post::where('user_id', $id)->get();

        $data = [
            'status'    => 'success',
            'code'      => 200,
            'post'      => $post
        ];

        return response()->json($data, $data['code']);
    }
}
