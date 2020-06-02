<?php

namespace App\Http\Controllers;
use App\Post;
use App\Category;

use Illuminate\Http\Request;

class pruebasController extends Controller
{
    public function testOrm()
    {
        $categories = Category::all();

        foreach ($categories as $category) {
            echo "<h1 style='color:red; text-transform:uppercase;'>{$category->name}</h1>";

            foreach ($category->post as $post) {
                echo "<h2> $post->title </h2>";
                echo"<h3 style='color:blue;'>{$post->user->name} - {$post->category->name}</h3>";
                echo "<p> $post->content </p>";
            }

            echo "<hr>";
        }
        die();
    }
}
