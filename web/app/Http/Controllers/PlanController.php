<?php

namespace App\Http\Controllers;

use App\Models\Charge;
use App\Models\Plan;
use App\Models\Session;
use Illuminate\Http\Request;
use Shopify\Clients\Rest;
use Shopify\Context;

class PlanController extends Controller
{
    public function ShopPlan(Request $request){
    try {
        $shop = Session::where('shop', $request->shop)->first();
        $charge = Charge::where('shop_id', $shop->id)->where('status','active')->latest()->first();
        if ($charge == null) {
            $data = [
                'is_subscribed' => false,
                'success' => true
            ];
        } else {
            $data = [
                'is_subscribed' => true,
                'success' => true
            ];
        }
    }catch (\Exception $exception){
        $data = [
            'error' => $exception->getMessage(),
            'success' => false
        ];
    }
        return response()->json($data);
    }

    public function SubscripePlan(Request $request){

        try {
            $session = getShop($request->get('shopifySession'));
            $client = new Rest($session->shop, $session->access_token);
            $plan=Plan::find($request->plan_id);
            $shop = $session->shop;
            $host = base64_encode("$shop/admin");
            $shop_url= env('APP_URL')."/api/return-url?host=$host&shop=$shop";
            $charge=Charge::where('status','active')->where('shop_id',$session->id)->latest()->first();

            if($charge && $charge->plan_id > $plan->id){
                if($charge->bars_count > $plan->bar_count){
                    $data=[
                        'message' => 'Delete Some Page Bars before moving to this plan',
                        'success' => false
                    ];
                    return response()->json($data);
                }
                if($charge->contacts_count > $plan->contacts_count){
                    $data=[
                        'message' => 'Delete Some Customers before moving to this plan',
                        'success' => false
                    ];
                    return response()->json($data);
                }
            }
                $productdata = [
                    "recurring_application_charge" => [
                        "name" => $plan->name,
                        "price" => $plan->price,
                        "return_url" => $shop_url,
                        "trial_days" => $plan->trial_days,
                        "test" => true,
                        "terms" => $plan->terms,
                        "capped_amount" => $plan->capped_amount,

                    ]
                ];

                $response = $client->post('/recurring_application_charges.json', $productdata);
                $response = $response->getDecodedBody();
                $response = json_decode(json_encode($response));
                $response = $response->recurring_application_charge;
                $charge = new Charge();
                $charge->name = $response->name;
                $charge->charge_id = $response->id;
                $charge->plan_id = $plan->id;
                $charge->status = $response->status;
                $charge->price = $response->price;
                $charge->capped_amount = $response->capped_amount;
                $charge->balance_used = $response->balance_used;
                $charge->risk_level = $response->risk_level;
                $charge->balance_remaining = $response->balance_remaining;
                $charge->trial_days = $response->trial_days;
                $charge->billing_on = $response->billing_on;
                $charge->api_client_id = $response->api_client_id;
                $charge->trial_ends_on = $response->trial_ends_on;

                $charge->test = $response->test;
                $charge->activated_on = $response->activated_on;
                $charge->cancelled_on = $response->cancelled_on;
                $charge->shop_id = $session->id;
                $charge->save();

                $data = [
                    'return_url' => $response->confirmation_url,
                    'success' => true
                ];

        }catch (\Exception $exception){
            $data = [
                'error' => $exception->getMessage(),
                'success' => false
            ];
        }
        return response()->json($data);
    }

    public function ReturnUrl(Request $request){
        $hostName = Context::$HOST_NAME;
        $session = Session::where('shop', $request->shop)->first();
        $shop = $session->shop;
        $host = base64_encode("$shop/admin");
        $charge=Charge::where('charge_id',$request->charge_id)->where('shop_id',$session->id)->first();
        if($charge){
            $charge->status='active';
            $charge->save();
        }
        $returnUrl = "https://$hostName?shop={$shop}&host=$host";
        return redirect($returnUrl);

    }


    public function CurrentPlan(Request $request){
        try {
            $session = getShop($request->get('shopifySession'));
            $client = new Rest($session->shop, $session->access_token);
            $charge=Charge::where('status','active')->where('shop_id',$session->id)->latest()->first();
            if($charge){
                $plan=Plan::find($charge->plan_id);
                if($plan){
                $data = [
                    'plan'=>$plan,
                    'bars_count'=>$charge->bars_count,
                    'contacts_count'=>$charge->contacts_count,
                    'success'=>true
                ];
            }
            }else{
                $data = [
                    'message'=>'No Subscribed Plan Found',
                    'success'=>true
                ];
            }


        }catch (\Exception $exception){
            $data=[
                'error'=>$exception->getMessage(),
                'success'=>false
            ];
        }
        return response()->json($data);
    }
}
