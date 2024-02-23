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
$shop=\App\Models\Session::where('shop','simbye.myshopify.com')->first();
    $new=\App\Models\Order::where('id',9)->first();
    $client = new Rest($shop->shop, $shop->access_token);
//$dec=json_decode($new->esim_all_profile);
$string=' [{
    "esimTranNo": "24022308264990",
    "orderNo": "B24022308586593",
    "transactionId": "1039",
    "imsi": "232104070108637",
    "iccid": "8943108170001086375",
    "ac": "LPA:1$rsp-eu.redteamobile.com$0B17DD3670BE448FAD3D51A12F6EDDC6",
    "qrCodeUrl": "https://p.qrsim.net/ad2b6c5e0208481484fe77923af2cd2e.png",
    "shortUrl": "https://p.qrsim.net/ad2b6c5e0208481484fe77923af2cd2e",
    "smdpStatus": "RELEASED",
    "eid": "",
    "activeType": 2,
    "dataType": 1,
    "activateTime": null,
    "expiredTime": "2024-08-21T08:45:04+0000",
    "totalVolume": 1073741824,
    "totalDuration": 7,
    "durationUnit": "DAY",
    "orderUsage": 0,
    "esimStatus": "GOT_RESOURCE",
    "packageList": [
      {
        "packageName": "Aaland Islands 1GB 7Days",
        "packageCode": "CKH256",
        "duration": 7,
        "volume": 1073741824,
        "locationCode": "AX",
        "createTime": "2024-02-23T08:45:03+0000"
      }
    ]
  }]';
    $metafield_data = [
        "metafield" =>
            [
                "key" => 'esimaccess_details',
                "value" => json_encode($new->esim_all_profile),
                "type" => "json_string",
                "namespace" => "Simbye",

            ]
    ];
    $order_metafield = $client->post('/orders/' . $new->shopify_id . '/metafields.json', $metafield_data);
    $order_metafield = $order_metafield->getDecodedBody();
dd($order_metafield);
    if (isset($order_metafield) && !isset($order_metafield['errors'])) {
        $new->metafield_id = $order_metafield['metafield']['id'];
        $new->save();
    }


});


Route::get('orders',[\App\Http\Controllers\OrderController::class,'Orders']);
Route::get('sync-orders',[\App\Http\Controllers\OrderController::class,'OrdersSync']);
Route::get('balance-detail',[\App\Http\Controllers\OrderController::class,'BalanceDetail']);
Route::get('order-detail',[\App\Http\Controllers\OrderController::class,'OrderDetail']);
Route::post('push-order',[\App\Http\Controllers\OrderController::class,'PushOrder']);

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
    return true;
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





    $session=\App\Models\Session::where('shop','simbye.myshopify.com')->first();

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






