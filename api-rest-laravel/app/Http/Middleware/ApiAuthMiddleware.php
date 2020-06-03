<?php

namespace App\Http\Middleware;

use Closure;

class ApiAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // Comprobar usuario identificado
        $token = $request->header('authorization');
        $jwtAuth = new \JwtAuth;
        $checkToken = $jwtAuth->checkToken($token);

        if ($checkToken) {
            return $next($request);
        } else {
            $data = array(
                'status'    => 'error',
                'code'      => 404,
                'message'   => 'Usuario no identificado'
            );

            return response()->json($data, $data['error']);
        }
    }
}
