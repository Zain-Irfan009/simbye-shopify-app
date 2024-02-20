<?php

namespace App\Http\Controllers;

use App\Models\Lineitem;
use App\Models\Order;
use App\Models\PageBar;
use Illuminate\Http\Request;
use Shopify\Clients\Rest;

class OrderController extends Controller
{
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
        $order = json_decode(json_encode($order), false);
        if($order->financial_status!='refunded' && $order->cancelled_at==null  ) {

            if(isset($order->discount_codes) && count($order->discount_codes) > 0) {

                $flag=0;
                foreach ($order->discount_codes as $discount){
                    $page_bar=PageBar::where('discount_code',$discount->code)->first();
                    if($page_bar){
                        $flag=1;
                        $discount_code=$discount->code;
                        $discount_amount=$discount->amount;
                        $discount_type=$discount->type;
                        $bar_id=$page_bar->id;
                        break;
                    }
                }
                if($flag==1) {
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

                        $newOrder->discount_code = $discount_code;
                    $newOrder->discount_amount = $discount_amount;
                    $newOrder->discount_type = $discount_type;
                    $newOrder->page_bar_id = $bar_id;

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
                    }
                }
            }
        }
    }
}
