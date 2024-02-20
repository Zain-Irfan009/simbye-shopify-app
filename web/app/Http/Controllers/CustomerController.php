<?php

namespace App\Http\Controllers;

use App\Models\Charge;
use App\Models\Customer;
use App\Models\PageBar;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Shopify\Clients\Rest;

class CustomerController extends Controller
{
    public function CreateCustomer(Request $request){
        $shop = Session::where('shop', $request->shop)->first();
        $client = new Rest($shop->shop, $shop->access_token);
        $password=Str::random(9);
        $page_bar=PageBar::where('id',$request->page_bar_id)->first();
        if($page_bar) {
            $check_customer = $client->get('/customers/search.json', [], [
                'query' => 'email:' . $request->email
            ]);
            $check_customer = $check_customer->getDecodedBody()['customers'];
            $check_customer = json_decode(json_encode($check_customer), false);
            if (!isset($check_customer->errors)) {
                if (count($check_customer)) {
                    $tags=$check_customer[0]->tags.',pagebar';
                    $customers = $client->put('/customers/' . $check_customer[0]->id . '.json', [
                        'customer' => [
                            "tags" => $tags,
                        ]
                    ]);
                    $customers = $customers->getDecodedBody()['customer'];
                    $customers = json_decode(json_encode($customers), false);
                    $update_customer = Customer::where('shopify_id', $customers->id)->first();
                    $update_customer->shop_id = $shop->id;
                    $update_customer->shopify_id = $customers->id;
                    $update_customer->first_name = $customers->first_name;
                    $update_customer->last_name = $customers->last_name;
                    $update_customer->email = $customers->email;
                    $update_customer->orders_count = $customers->orders_count;
                    $update_customer->state = $customers->state;
                    $update_customer->total_spent = $customers->total_spent;
                    $update_customer->last_order_id = $customers->last_order_id;
                    $update_customer->last_order_name = $customers->last_order_name;
                    $update_customer->note = $customers->note;
                    $update_customer->currency = $customers->currency;
                    $update_customer->tags = $customers->tags;
                    $update_customer->save();
                    $data = [
                        'message' => 'Customer Subscribed Successfully',
                        'discount_code'=>$page_bar->discount_code,
                        'discount'=>$page_bar->discount,
                        'success' => true
                    ];

                } else {
                    $customers = $client->post('/customers.json', [

                        'customer' => [
                            'first_name' => $request->name,
                            'email' => $request->email,
                            "password" => $password,
                            "password_confirmation" => $password,
                            "tags" => "pagebar",

                        ]
                    ]);
                    $customers = $customers->getDecodedBody()['customer'];
                    $customers = json_decode(json_encode($customers), false);
                    if (!isset($check_customer->errors)) {
                        $update_customer = new Customer();
                        $update_customer->shop_id = $shop->id;
                        $update_customer->shopify_id = $customers->id;
                        $update_customer->first_name = $customers->first_name;
                        $update_customer->last_name = $customers->last_name;
                        $update_customer->email = $customers->email;
                        $update_customer->orders_count = $customers->orders_count;
                        $update_customer->state = $customers->state;
                        $update_customer->total_spent = $customers->total_spent;
                        $update_customer->last_order_id = $customers->last_order_id;
                        $update_customer->last_order_name = $customers->last_order_name;
                        $update_customer->note = $customers->note;
                        $update_customer->currency = $customers->currency;
                        $update_customer->tags = $customers->tags;
                        $update_customer->page_bar_id = $page_bar->id;
                        $update_customer->save();
                        $data = [
                            'message' => 'Customer Subscribed Successfully',
                            'discount_code'=>$page_bar->discount_code,
                            'discount'=>$page_bar->discount,
                            'success' => true
                        ];
                        $page_bar->leads=1;
                        $page_bar->save();
                        $charge=Charge::where('status','active')->where('shop_id',$shop->id)->latest()->first();
                        if($charge) {
                            $charge->contacts_count = $charge->contacts_count + 1;
                            $charge->save();
                        }
                        return response()->json($data);


                    } else {
                        $data = [
                            'message' => 'Server Error',
                            'success' => false
                        ];

                    }

                }
            } else {
                $data = [
                    'message' => 'Server Error',
                    'success' => false
                ];
            }
            return response()->json($data);
        }
    }
}
