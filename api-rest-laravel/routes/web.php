<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;

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
Route::get('usuario/pruebas', 'userController@pruebas');
Route::get('post/pruebas', 'postController@pruebas');
Route::get('categoria/pruebas', 'categoryController@pruebas'); */

// Rutas de usuario
Route::post('api/register', "userController@register");
Route::post('api/login', "userController@login");
Route::put('api/update', "userController@update");
Route::delete('api/destroy', "userController@destroy");

