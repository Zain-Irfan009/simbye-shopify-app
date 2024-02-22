<?php

namespace App\Http\Controllers;

use App\Models\Lineitem;
use App\Models\Log;
use App\Models\Order;
use App\Models\PageBar;
use App\Models\Session;
use App\Models\Setting;
use Illuminate\Http\Request;
use Shopify\Clients\Rest;

class OrderController extends Controller
{

    public function Orders(Request $request)
    {
        $shop = getShop($request->get('shopifySession'));
        $orders = Order::query();
        if($request->value) {
            $orders = $orders->where('order_number', 'like', '%' . $request->value . '%');
        }
        if($request->status==0) {

        }else if($request->status==1){
            $orders = $orders->whereNull('fulfillment_status');
        }else if($request->status==2){
            $orders = $orders->where('fulfillment_status','partial');
        }
        else if($request->status==3){
            $orders = $orders->where('fulfillment_status','fulfilled');
        }
        if($request->payment_status=='all') {

        }else if($request->payment_status=='paid'){
            $orders =$orders->where('financial_status','paid');
        }else if($request->payment_status=='unpaid'){
            $orders = $orders->where('financial_status','unpaid');
        }
        $orders=$orders->where('shop_id', $shop->id)->orderBy('id', 'Desc')->paginate(20);
        return response()->json($orders);
    }
    public function OrdersSync(Request $request){
        $shop = getShop($request->get('shopifySession'));
        $this->syncOrders($shop);
    }
    public function syncOrders($session, $nextPage = null)
    {
        $client = new Rest($session->shop, $session->access_token);
        $result = $client->get('orders', [], [
            'limit' => 250,
            'page_info' => $nextPage,
        ]);
        $orders = $result->getDecodedBody()['orders'];

        foreach ($orders as $order) {
            $this->createUpdateOrder($order, $session);
        }
        if (isset($result)) {
            if ($result->getPageInfo() ? true : false) {
                $nextUrl = $result->getPageInfo()->getNextPageUrl();
                if (isset($nextUrl)) {
                    $arr = explode('page_info=', $result->getPageInfo()->getNextPageUrl());
                    $this->syncOrders($arr[count($arr) - 1]);
                }
            }
        }
    }

    public function createUpdateOrder($order, $shop)
    {

        $client = new Rest($shop->shop, $shop->access_token);


        $order = json_decode(json_encode($order), false);
        if($order->financial_status!='refunded' && $order->cancelled_at==null  ) {

                    $newOrder = Order::where('shopify_id', $order->id)->where('shop_id', $shop->id)->first();
                    if ($newOrder == null) {
                        $newOrder = new Order();
                    }
                    $newOrder->shopify_id = $order->id;
                    $newOrder->email = $order->email;
                    $newOrder->order_number = $order->name;
                    if (isset($order->shipping_address)) {
                        $newOrder->shipping_name = $order->shipping_address->name;
                        $newOrder->address1 = $order->shipping_address->address1;
                        $newOrder->address2 = $order->shipping_address->address2;
                        $newOrder->phone = $order->shipping_address->phone;
                        $newOrder->city = $order->shipping_address->city;
                        $newOrder->zip = $order->shipping_address->zip;
                        $newOrder->province = $order->shipping_address->province;
                        $newOrder->country = $order->shipping_address->country;
                    }
                    $newOrder->financial_status = $order->financial_status;
                    $newOrder->fulfillment_status = $order->fulfillment_status;
                    if (isset($order->customer)) {
                        $newOrder->first_name = $order->customer->first_name;
                        $newOrder->last_name = $order->customer->last_name;
                        $newOrder->customer_phone = $order->customer->phone;
                        $newOrder->customer_email = $order->customer->email;
                        $newOrder->customer_id = $order->customer->id;
                    }



                    $newOrder->shopify_created_at = date_create($order->created_at)->format('Y-m-d h:i:s');
                    $newOrder->shopify_updated_at = date_create($order->updated_at)->format('Y-m-d h:i:s');
                    $newOrder->tags = $order->tags;
                    $newOrder->note = $order->note;
                    $newOrder->total_price = $order->total_price;
                    $newOrder->currency = $order->currency;

                    $newOrder->subtotal_price = $order->subtotal_price;
                    $newOrder->total_weight = $order->total_weight;
                    $newOrder->taxes_included = $order->taxes_included;
                    $newOrder->total_tax = $order->total_tax;
                    $newOrder->currency = $order->currency;
                    $newOrder->total_discounts = $order->total_discounts;
                    $newOrder->shop_id = $shop->id;
                    $newOrder->save();

                    $packageInfoList = array();
                    foreach ($order->line_items as $item) {

                        $new_line = Lineitem::where('shopify_id', $item->id)->where('order_id', $newOrder->id)->where('shop_id', $shop->id)->first();
                        if ($new_line == null) {
                            $new_line = new Lineitem();
                        }
                        $new_line->shopify_id = $item->id;
                        $new_line->shopify_order_id = $order->id;
                        $new_line->shopify_product_id = $item->product_id;
                        $new_line->shopify_variant_id = $item->variant_id;
                        $new_line->title = $item->title;
                        $new_line->quantity = $item->quantity;
                        $new_line->sku = $item->sku;
                        $new_line->variant_title = $item->variant_title;
                        $new_line->title = $item->title;
                        $new_line->vendor = $item->vendor;
                        $new_line->price = $item->price;
                        $new_line->requires_shipping = $item->requires_shipping;
                        $new_line->taxable = $item->taxable;
                        $new_line->name = $item->name;
                        $new_line->properties = json_encode($item->properties, true);
                        $new_line->fulfillable_quantity = $item->fulfillable_quantity;
                        $new_line->fulfillment_status = $item->fulfillment_status;
                        $new_line->order_id = $newOrder->id;
                        $new_line->shop_id = $shop->id;
                        $new_line->save();

                        $packageInfoList[] = array(
                            'packageCode' => $item->sku,
                            'count' => $item->quantity
                        );
                    }

            $setting=Setting::where('shop_id',$shop->id)->first();

                    if($setting && $setting->status==1){

            $transactionId = $order->order_number;
            $request_body = array(
                "transactionId" => $transactionId,
                "packageInfoList" => $packageInfoList
            );
            $request_json = json_encode($request_body);

            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => 'https://api.esimaccess.com/api/v1/open/esim/order',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS =>$request_json,
                CURLOPT_HTTPHEADER => array(
                    'RT-AccessCode:'.$setting->access_code,
                    'Content-Type: application/json'
                ),
            ));

            $response = curl_exec($curl);
            $response=json_decode($response);



            if($response->success==true){
                if(isset($response->obj)) {
                    $orderNo = $response->obj->orderNo;
                    $newOrder->esim_order_id=$orderNo;
                    $newOrder->save();

            $order_update = $client->put('/orders/' . $newOrder->shopify_id . '.json', [
                "order" => [
                    "note" => $orderNo,
                ]
            ]);
            $order_update = $order_update->getDecodedBody();

            if (isset($order_update) && !isset($order_update['errors'])) {


                $curl1 = curl_init();

                $request_data = array(
                    "orderNo" => $orderNo,
                    "iccid" => "",
                    "pager" => array(
                        "pageNum" => 1,
                        "pageSize" => 500
                    )
                );
                $request_data = json_encode($request_data);

                curl_setopt_array($curl1, array(
                    CURLOPT_URL => 'https://api.esimaccess.com/api/v1/open/esim/query',
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => '',
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 0,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => 'POST',
                    CURLOPT_POSTFIELDS => $request_data,
                    CURLOPT_HTTPHEADER => array(
                        'RT-AccessCode:'.$setting->access_code,
                        'Content-Type: application/json'
                    ),
                ));

                $response1 = curl_exec($curl1);
                curl_close($curl1);
                $response1 = json_decode($response1, true);
                if ($response1['success'] == true) {
                    if ($response1 && isset($response1['obj']['esimList'])) {

                        $esim_list = $response1['obj']['esimList'];
                        $newOrder->esim_all_profile = json_encode($esim_list);
                        $newOrder->save();


                        $metafield_data = [
                            "metafield" =>
                                [
                                    "key" => 'data',
                                    "value" => json_encode($esim_list),
                                    "type" => "json_string",
                                    "namespace" => "Esim",

                                ]
                        ];
                        $order_metafield = $client->post('/orders/' . $newOrder->shopify_id . '/metafields.json', $metafield_data);
                        $order_metafield = $order_metafield->getDecodedBody();

                        if (isset($order_metafield) && !isset($order_metafield['errors'])) {
                            $newOrder->metafield_id = $order_metafield['metafield']['id'];
                            $newOrder->save();
                        }
                    }
                }
                }
            }
                }else{

                $newOrder->error_true=1;
                $newOrder->error_message=json_encode($response);
                $newOrder->save();
            }
            }


        }
    }


    public function BalanceDetail(Request $request){

        $order=Order::where('shopify_id',$request->id)->first();
        if($order) {
            $setting=Setting::where('shop_id',$order->shop_id)->first();
            $curl1 = curl_init();


            $request_data = array(
                "orderNo" => $order->esim_order_id,
                "iccid" => "",
                "pager" => array(
                    "pageNum" => 1,
                    "pageSize" => 500
                )
            );
            $request_data = json_encode($request_data);

            curl_setopt_array($curl1, array(
                CURLOPT_URL => 'https://api.esimaccess.com/api/v1/open/esim/query',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $request_data,
                CURLOPT_HTTPHEADER => array(
                    'RT-AccessCode:'.$setting->access_code,
                    'Content-Type: application/json'
                ),
            ));

            $response1 = curl_exec($curl1);
            curl_close($curl1);
            return response()->json($response1);
        }


    }

    public function OrderDetail(Request $request){

$order=Order::find($request->id);
if($order){
    if($order->error_true==1){
        $json=$order->error_message;
    }else{
        $json=$order->esim_all_profile;
    }

    return response()->json(['data'=>$json]);
}
    }

    public function PushOrder(Request $request)
    {
        $shop = getShop($request->get('shopifySession'));
        $setting = Setting::where('shop_id', $shop->id)->first();
        $client = new Rest($shop->shop, $shop->access_token);
        $order = Order::find($request->id);
        if ($setting && $setting->status == 1) {
            if ($order){
                $packageInfoList = array();
                $line_items=Lineitem::where('order_id',$order->id)->get();
                foreach ($line_items as $item) {

                    $packageInfoList[] = array(
                        'packageCode' => $item->sku,
                        'count' => $item->quantity
                    );
                }
                $transactionId = $order->order_number;
            $request_body = array(
                "transactionId" => $transactionId,
                "packageInfoList" => $packageInfoList
            );
            $request_json = json_encode($request_body);

            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => 'https://api.esimaccess.com/api/v1/open/esim/order',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $request_json,
                CURLOPT_HTTPHEADER => array(
                    'RT-AccessCode:' . $setting->access_code,
                    'Content-Type: application/json'
                ),
            ));

            $response = curl_exec($curl);
            $response = json_decode($response);


            if ($response->success == true) {
                if (isset($response->obj)) {
                    $orderNo = $response->obj->orderNo;
                    $order->esim_order_id = $orderNo;
                    $order->error_true=0;
                    $order->error_message=null;
                    $order->save();


                    $order_update = $client->put('/orders/' . $order->shopify_id . '.json', [
                        "order" => [
                            "note" => $orderNo,
                        ]
                    ]);
                    $order_update = $order_update->getDecodedBody();

                    if (isset($order_update) && !isset($order_update['errors'])) {


                        $curl1 = curl_init();

                        $request_data = array(
                            "orderNo" => $orderNo,
                            "iccid" => "",
                            "pager" => array(
                                "pageNum" => 1,
                                "pageSize" => 500
                            )
                        );
                        $request_data = json_encode($request_data);

                        curl_setopt_array($curl1, array(
                            CURLOPT_URL => 'https://api.esimaccess.com/api/v1/open/esim/query',
                            CURLOPT_RETURNTRANSFER => true,
                            CURLOPT_ENCODING => '',
                            CURLOPT_MAXREDIRS => 10,
                            CURLOPT_TIMEOUT => 0,
                            CURLOPT_FOLLOWLOCATION => true,
                            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                            CURLOPT_CUSTOMREQUEST => 'POST',
                            CURLOPT_POSTFIELDS => $request_data,
                            CURLOPT_HTTPHEADER => array(
                                'RT-AccessCode:' . $setting->access_code,
                                'Content-Type: application/json'
                            ),
                        ));

                        $response1 = curl_exec($curl1);
                        curl_close($curl1);
                        $response1 = json_decode($response1, true);
                        if ($response1['success'] == true) {
                            if ($response1 && isset($response1['obj']['esimList'])) {

                                $esim_list = $response1['obj']['esimList'];
                                $order->esim_all_profile = json_encode($esim_list);
                                $order->save();


                                $metafield_data = [
                                    "metafield" =>
                                        [
                                            "key" => 'data',
                                            "value" => json_encode($esim_list),
                                            "type" => "json_string",
                                            "namespace" => "Esim",

                                        ]
                                ];
                                $order_metafield = $client->post('/orders/' . $order->shopify_id . '/metafields.json', $metafield_data);
                                $order_metafield = $order_metafield->getDecodedBody();

                                if (isset($order_metafield) && !isset($order_metafield['errors'])) {
                                    $order->metafield_id = $order_metafield['metafield']['id'];
                                    $order->save();
                                }
                            }
                        }
                    }
                }
                $data=[
                    'success'=>true,
                    'message'=>'Order Pushed Successfully'
                ];
            } else {

                $order->error_true = 1;
                $order->error_message = json_encode($response);
                $order->save();
                $error=json_decode($order->error_message);

                $data=[
                    'success'=>false,
                    'message'=>$error->errorMsg
                ];
            }

        }

    }else{
            $data=[
                'success'=>false,
                'message'=>'Please Enable App from Setting'
            ];
        }
        return response()->json($data);
    }
}
