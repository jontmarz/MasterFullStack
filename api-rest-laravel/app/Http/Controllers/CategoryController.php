<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Category;

class CategoryController extends Controller
{
    public $params_array;

    public function __construct(Request $request)
    {
        $this->middleware('api_auth', ['except'=>['index', 'show']]);

        $json = $request->input('json', null);
        $this->params_array = json_decode($json, true);
    }

    public function index()
    {
        $categories = Category::all();

        $data = [
            'status'    => 'success',
            'code'      => 200,
            'categories'=> $categories
        ];

        return response()-> json($data);
    }

    public function show($id)
    {
        $category = Category::find($id);

        if (is_object($category)) {
            $data = [
                'status'    => 'success',
                'code'      => 200,
                'category'  => $category
            ];
        } else {
            $data = [
                'status'    => 'error',
                'code'      => 404,
                'message'   => 'La categoría no existe'
            ];
        }

        return response()->json($data, $data['code']);
    }

    public function store(Request $request)
    {
        // Si valida datos
        if (!empty($this->params_array)) {
            $validate = \Validator::make($this->params_array, [
                'name' => 'required|alpha',
            ]);

            // Guardar categoría
            if ($validate->fails()) {
                $data = [
                    'status'    => 'error',
                    'code'      => 404,
                    'message'   => 'No se ha guardado la categoría'
                ];
            } else {
                $category = new category();
                $category->name = $this->params_array['name'];
                $category->save();

                $data = [
                    'status'    => 'success',
                    'code'      => 200,
                    'message'   => 'Se ha guardado la categoría'
                ];
            }

        } else {
            $data = [
                'status'    => 'error',
                'code'      => 404,
                'message'   => 'No se ha guardado la categoría'
            ];
        }

        return response()->json($data, $data['code']);
    }

    public function update($id, Request $request)
    {
        // Si los datos por POST son válidos
        if (!empty($this->params_array)) {
            $validate = \Validator::make($this->params_array, [
                'name' => 'required|alpha'
            ]);

            // Ocultar campos q no se cambiarán
            unset($this->params_array['id']);
            unset($this->params_array['created_at']);

            // Actualizar registro
            $category = Category::where('id', $id)->update($this->params_array);

            $data = [
                'status'    => 'success',
                'code'      => 200,
                'category'  => $this->params_array
            ];
        } else {
            $data = [
                'status'    => 'error',
                'code'      => 404,
                'message'   => 'La categoría no se ha actualizado'
            ];
        }

        return response()->json($data, $data['code']);
    }

    public function destroy($id, Response $request)
    {
        // Obtener datos por post
        $user = $this->params_array;

        // Consultar categoría
        $category = Category::where('id', $id)
                            ->first();

        if (!empty($category)) {
            // Borrar categoría
            $category->delete();

            // Devolver respuesta
            $data = [
                'status'    => 'success',
                'code'      => 200,
                'category'  => $category
            ];
        } else {
            $data = [
                'status'    => 'error',
                'code'      => 404,
                'message'   => 'El registro no existe'
            ];
        }

        return response()->json($data, $data['code']);
    }
}
