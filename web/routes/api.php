<?php

use App\Models\Charge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Shopify\Clients\Rest;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/', function () {
    return "Hello API";
});


Route::get('orders',[\App\Http\Controllers\OrderController::class,'Orders']);
Route::get('sync-orders',[\App\Http\Controllers\OrderController::class,'OrdersSync']);
Route::get('balance-detail',[\App\Http\Controllers\OrderController::class,'BalanceDetail']);

Route::get('setting',[\App\Http\Controllers\SettingController::class,'Setting']);
Route::post('setting-save',[\App\Http\Controllers\SettingController::class,'SettingSave']);












//Order Webhook
Route::post('/webhooks/order-create', function (Request $request) {
    try {
        $order=json_decode($request->getContent());
        $shop=$request->header('x-shopify-shop-domain');
        $shop=\App\Models\Session::where('shop',$shop)->first();
        \App\Jobs\OrderWebhookJob::dispatch($order,$shop);
    } catch (\Exception $e) {

    }
});


//app-uninstall
Route::post('/webhooks/app-uninstall', function (Request $request) {
    try {

        $shop=$request->header('x-shopify-shop-domain');
        $shop=\App\Models\Session::where('shop',$shop)->first();
      \App\Models\Order::where('shop_id',$shop->id)->delete();

        $shop->forceDelete();

    } catch (\Exception $e) {
    }
});

//Get All Webhook
Route::get('/testing', function() {





    $session=\App\Models\Session::where('shop','tlx-new-brand.myshopify.com')->first();

    $client = new Rest($session->shop, $session->access_token);

    $response = $client->get('/webhooks.json');
//
//        $webhook_create = $client->post( '/webhooks.json', [
//
//        "webhook" => array(
//            "topic" => "products/delete",
//            "format" => "json",
//            "address" => "https://marketplace.onewholesale.ca/api/webhooks/product-delete"
//        )
//    ]);
//    dd($webhook_create->getDecodedBody());

//    $delete_create_webhook = $client->delete( '/webhooks/1205956903169.json');
//dd($delete_create_webhook->getDecodedBody());
    dd($response->getDecodedBody());

})->name('getwebbhook');






