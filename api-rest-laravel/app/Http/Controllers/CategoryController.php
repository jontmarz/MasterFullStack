<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();

        $data = array(
            'status'    => 'success',
            'code'      => 200,
            'categories'=> $categories
        );
        return response()-> json($data);
    }
}
