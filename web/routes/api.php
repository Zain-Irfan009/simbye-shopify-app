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


//Route::group(['middleware' => ['shopify.auth']], function () {
//product
    Route::get('sync-products', [\App\Http\Controllers\ProductController::class, 'ProductsSync']);

//Collection
    Route::get('sync-collections', [\App\Http\Controllers\CollectionController::class, 'CollectionsSync']);

//Blog
    Route::get('sync-blogs', [\App\Http\Controllers\BlogController::class, 'BlogsSync']);

//Blog
    Route::get('sync-pages', [\App\Http\Controllers\PageController::class, 'PagesSync']);


//Get Product,Collection,Blog,Page Data
    Route::get('get-data', [\App\Http\Controllers\DashboardController::class, 'getData']);

//PageBar
    Route::get('page-bar', [\App\Http\Controllers\DashboardController::class, 'PageBar']);
Route::get('page-bar-view', [\App\Http\Controllers\DashboardController::class, 'PageBarView']);
    Route::get('page-bar-detail', [\App\Http\Controllers\DashboardController::class, 'PageBarDetail']);
    Route::post('save-data', [\App\Http\Controllers\DashboardController::class, 'SaveData']);
    Route::post('update-data', [\App\Http\Controllers\DashboardController::class, 'UpdateData']);
    Route::delete('delete-data', [\App\Http\Controllers\DashboardController::class, 'DeleteData']);
    Route::get('update-bar-status', [\App\Http\Controllers\DashboardController::class, 'UpdatebarStatus']);
    Route::get('export', [\App\Http\Controllers\DashboardController::class, 'Export']);

//current plan
Route::get('current-plan', [\App\Http\Controllers\PlanController::class, 'CurrentPlan']);
//});


//plans
Route::get('shop-plan', [\App\Http\Controllers\PlanController::class, 'ShopPlan']);
Route::any('subscripe-plan', [\App\Http\Controllers\PlanController::class, 'SubscripePlan']);

Route::any('return-url', [\App\Http\Controllers\PlanController::class, 'ReturnUrl']);

Route::any('subscribe-customer', [\App\Http\Controllers\CustomerController::class, 'CreateCustomer']);

//Product Webhook
Route::post('/webhooks/product-create', function (Request $request) {
    try {

        $product=json_decode($request->getContent());
        $shop=$request->header('x-shopify-shop-domain');
        $shop=\App\Models\Session::where('shop',$shop)->first();
        \App\Jobs\ProductWebhookJob::dispatch($product,$shop);

    } catch (\Exception $e) {

    }
});

Route::post('/webhooks/product-update', function (Request $request) {
    try {

        $product=json_decode($request->getContent());

        $shop=$request->header('x-shopify-shop-domain');
        $shop=\App\Models\Session::where('shop',$shop)->first();
        \App\Jobs\ProductWebhookJob::dispatch($product,$shop);

    } catch (\Exception $e) {

    }
});

Route::post('/webhooks/product-delete', function (Request $request) {
    try {
        $product=json_decode($request->getContent());
        $shop=$request->header('x-shopify-shop-domain');
        $shop=\App\Models\Session::where('shop',$shop)->first();
        $product_controller=new \App\Http\Controllers\ProductController();
        $product_controller->DeleteProduct($product,$shop);

    } catch (\Exception $e) {

    }
});


//Collection Webhook
Route::post('/webhooks/collection-create', function (Request $request) {
    try {
        $collection=json_decode($request->getContent());
        $shop=$request->header('x-shopify-shop-domain');
        $shop=\App\Models\Session::where('shop',$shop)->first();
        \App\Jobs\CollectionWebhookJob::dispatch($collection,$shop);
    } catch (\Exception $e) {

    }
});

Route::post('/webhooks/collection-update', function (Request $request) {
    try {
        $collection=json_decode($request->getContent());
        $shop=$request->header('x-shopify-shop-domain');
        $shop=\App\Models\Session::where('shop',$shop)->first();
        \App\Jobs\CollectionWebhookJob::dispatch($collection,$shop);

    } catch (\Exception $e) {
    }
});

Route::post('/webhooks/collection-delete', function (Request $request) {
    try {
        $collection=json_decode($request->getContent());
        $shop=$request->header('x-shopify-shop-domain');
        $shop=\App\Models\Session::where('shop',$shop)->first();
        \App\Models\Collection::where('shopify_id',$collection->id)->delete();

    } catch (\Exception $e) {

    }
});



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

//customer webhook

Route::post('/webhooks/customer-delete', function (Request $request) {
    try {
        $customer=json_decode($request->getContent());
        $shop=$request->header('x-shopify-shop-domain');
        $shop=\App\Models\Session::where('shop',$shop)->first();
        $check_customer=\App\Models\Customer::where('shopify_id',$customer->id)->first();
        if($check_customer){
            $charge=Charge::where('status','active')->where('shop_id',$shop->id)->latest()->first();
            if($charge && $charge->contacts_count!=0){
                $charge->contacts_count = $charge->contacts_count - 1;
                $charge->save();
            }
            $page_bar=\App\Models\PageBar::where('id',$check_customer->page_bar_id)->first();
            if($page_bar && $page_bar->leads!=0){
                $page_bar->leads = $page_bar->leads - 1;
                $page_bar->save();
            }
            $check_customer->delete();
        }

    } catch (\Exception $e) {

    }
});

//app-uninstall
Route::post('/webhooks/app-uninstall', function (Request $request) {
    try {
        $product=json_decode($request->getContent());
        $shop=$request->header('x-shopify-shop-domain');
        $shop=\App\Models\Session::where('shop',$shop)->first();
        Charge::where('shop_id',$shop->id)->delete();
        \App\Models\Customer::where('shop_id',$shop->id)->delete();
        \App\Models\Blog::where('shop_id',$shop->id)->delete();
        \App\Models\Page::where('shop_id',$shop->id)->delete();
        \App\Models\ProductVariant::where('shop_id',$shop->id)->delete();
        \App\Models\Product::where('shop_id',$shop->id)->delete();
        \App\Models\Collection::where('shop_id',$shop->id)->delete();
        \App\Models\PageBarSuccessForm::where('shop_id',$shop->id)->delete();
        \App\Models\PageBarForm::where('shop_id',$shop->id)->delete();
        \App\Models\PageBar::where('shop_id',$shop->id)->delete();

        $shop->forceDelete();

    } catch (\Exception $e) {
    }
});

//Get All Webhook
Route::get('/testing', function() {





    $session=\App\Models\Session::where('shop','asadtest321.myshopify.com')->first();

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






