<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;
use \App\Http\Middleware\ApiAuthMiddleware;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return "<h1> Esto es un titulo </h1>";
});

Route::get('/welcome', function () {
    return view('welcome');
});
/* //Pruebas de ruta
Route::get('/testOrm', 'pruebasController@testOrm');
Route::get('post/pruebas', 'postController@pruebas');
Route::get('categoria/pruebas', 'categoryController@pruebas');
Route::get('api/pruebas', 'userController@pruebas');
Route::post('api/receive', 'userController@receive'); */

// Rutas de usuario
Route::post('api/register', "userController@register");
Route::post('api/login', "userController@login");
Route::put('api/user/update', "userController@update");
Route::delete('api/destroy', "userController@destroy");
Route::post('api/user/upload', "userController@upload")->middleware(ApiAuthMiddleware::class);
Route::get('api/user/avatar/{filename}', 'userController@getImage');
Route::get('api/user/detail/{id}', 'userController@detailsProfile');

// Rutas categorías
Route::resource('/api/category', 'categoryController');

// Rutas Entradas
Route::resource('api/post', 'postController');
Route::post('api/post/upload', 'postController@upload');
Route::get('api/post/image/{filename}', 'postController@getImage');
Route::get('api/post/category/{id}', 'postController@getPostbyCategory');
Route::get('api/post/user/{id}', 'postController@getPostbyUser');

