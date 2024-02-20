<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Charge;
use App\Models\Collection;
use App\Models\Order;
use App\Models\Page;
use App\Models\PageBar;
use App\Models\PageBarForm;
use App\Models\PageBarSuccessForm;
use App\Models\Plan;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Shopify\Clients\Rest;

class DashboardController extends Controller
{


    public function PageBar(Request $request){
        try {
            $shop = getShop($request->get('shopifySession'));
            $page_bars=PageBar::select('id','bar_name','leads','is_active')->where('shop_id',$shop->id)->orderBy('id','desc')->get();
            $charge=Charge::where('status','active')->where('shop_id',$shop->id)->latest()->first();
            $limit=false;
            $contacts_limit=false;
            if($charge){
                $plan=Plan::find($charge->plan_id);
                if($plan){
                    if($charge->bars_count==$plan->bar_count){
                        $limit=true;
                    }
                    if($charge->contacts_count==$plan->contacts_count){
                        $contacts_limit=true;
                    }
                }
            }
            $data = [
                'data' => $page_bars,
                'limit'=>$limit,
                'contacts_limit'=>$contacts_limit,
                'success'=>true
            ];
        }catch (\Exception $exception){
            $data=[
                'error'=>$exception->getMessage(),
                'success'=>false
            ];
        }
        return response()->json($data);
    }

public function PageBarView(Request $request){
    try {
        $shop = getShop($request->get('shopifySession'));
        $page_bars=PageBar::where('shop_id',$shop->id)->where('id',$request->id)->with('bar_form','bar_success_form')->get();
        $data = [
            'data' => $page_bars,
            'success'=>true
        ];
    }catch (\Exception $exception){
        $data=[
            'error'=>$exception->getMessage(),
            'success'=>false
        ];
    }
    return response()->json($data);
}
    public function PageBarDetail(Request $request){

        try {
            $shop = getShop($request->get('shopifySession'));
            $page_bar_details = Order::select('customer_id', 'first_name', 'last_name', DB::raw('SUM(total_price) as total_price'), DB::raw('COUNT(*) as order_count'), 'currency')
                ->where('page_bar_id', $request->id)
                ->where('shop_id', $shop->id)
                ->groupBy('customer_id', 'first_name', 'last_name', 'currency')
                ->get();

            $data = [
                'data' => $page_bar_details,
                'success'=>true
            ];
        } catch (\Exception $exception) {
            $data = [
                'error' => $exception->getMessage(),
                'success' => false
            ];
        }
        return response()->json($data);

    }


    public function Export(Request $request){
     try {

    $shop = getShop($request->get('shopifySession'));
         $page_bar_details = Order::select('customer_id', 'first_name', 'last_name', DB::raw('SUM(total_price) as total_price'), DB::raw('COUNT(*) as order_count'), 'currency')
             ->where('page_bar_id', $request->id)
             ->where('shop_id', $shop->id)
             ->groupBy('customer_id', 'first_name', 'last_name', 'currency')
             ->get();
    $data_array = array();

    foreach ($page_bar_details as $page_bar_detail) {
        $data['customer_name'] = $page_bar_detail->first_name.' '.$page_bar_detail->last_name;
        $data['total_price'] = $page_bar_detail->currency.$page_bar_detail->total_price;
        $data['order_count'] = $page_bar_detail->order_count.' orders';
        array_push($data_array, $data);
    }


    $name = 'Bar-Detail-' . time() . '.csv';
         $file = fopen(public_path('export/' . $name), 'w+');

    // Add the CSV headers
    fputcsv($file, ['Customer Name', 'Order', 'Amount Spend']);
    foreach ($data_array as $order_a) {

        fputcsv($file, [
            $order_a['customer_name'],
            $order_a['order_count'],
            $order_a['total_price'],
        ]);
    }

    fclose($file);
    return response()->json([
        'success' => true,
        'name'=>$name,
        'message'=>'Export Successfully',
        'link' => asset('export/'.$name),
    ]);
        }catch (\Exception $exception){
         return response()->json([
             'error' => $exception->getMessage(),
             'success' => false
         ]);
        }

    }
    public function getData(Request $request){
        try {
            $shop = getShop($request->get('shopifySession'));
            $data = null;
            if ($request->type == 'home') {

            } elseif ($request->type == 'products') {
                $data = Product::query();
            } elseif ($request->type == 'collections') {
                $data = Collection::query();
            } elseif ($request->type == 'blogs') {
                $data = Blog::query();
            } elseif ($request->type == 'pages') {
                $data = Page::query();
            }

            if($request->type!='home') {
                $selectedIdsString = PageBar::where('shop_id', $shop->id)->value('type_ids');

                // Convert comma-separated string to an array of integers
                $selectedIds = explode(',', $selectedIdsString);

                $data = $data->whereNotIn('id', $selectedIds);
                if ($request->value) {
                    $data = $data->where('title', 'like', '%' . $request->value . '%');
                }
                $data=$data->get();
            }
            $data = [
                'data' => $data,
                'success'=>true
            ];

        }catch (\Exception $exception){
            $data=[
              'error'=>$exception->getMessage(),
                'success'=>false
            ];
        }
        return response()->json($data);
    }

    public function SaveData(Request $request){
        try {
            $shop = getShop($request->get('shopifySession'));
            $client = new Rest($shop->shop, $shop->access_token);
            $page_bar=new PageBar();
            $page_bar->shop_id=$shop->id;
            $page_bar->bar_name=$request->bar_name;
            $page_bar->discount_code=$request->discount_code;
            $page_bar->discount=$request->discount;
            $page_bar->type=$request->type;
            $page_bar->type_ids=$request->type_ids;
            $page_bar->bar_title=$request->bar_title;
            $page_bar->bar_title_color=$request->bar_title_color;
            $page_bar->bar_color=$request->bar_color;
            $page_bar->bar_scroll=$request->bar_scroll;
            $page_bar->bar_button_enabled=$request->bar_button_enabled;
            $page_bar->bar_button_text=$request->bar_button_text;
            $page_bar->bar_button_color=$request->bar_button_color;
            $page_bar->bar_button_text_color=$request->bar_button_text_color;
            $page_bar->bar_close_button_color=$request->bar_close_button_color;
            $page_bar->bar_title_text_size=$request->bar_title_text_size;
            $page_bar->bar_title_text_weight=$request->bar_title_text_weight;
            $page_bar->bar_button_text_size=$request->bar_button_text_size;
            $page_bar->bar_button_text_weight=$request->bar_button_text_weight;
            $page_bar->save();

            $page_bar_form=new PageBarForm();
            $page_bar_form->shop_id=$shop->id;
            $page_bar_form->page_bar_id=$page_bar->id;
            $page_bar_form->form_name_enabled=$request->form_name_enabled;
            $page_bar_form->form_email_enabled=$request->form_email_enabled;
            $page_bar_form->form_phone_enabled=$request->form_phone_enabled;

            if ($request->hasFile('form_image')) {
                $file = $request->file('form_image');
                $destinationPath = 'images/';
                $filename1 = now()->format('YmdHi') . str_replace([' ', '(', ')'], '-', $file->getClientOriginalName());
                $file->move($destinationPath, $filename1);
                $filename1 = (asset('images/' . $filename1));
                $page_bar_form->form_image=$filename1;
            }

            $page_bar_form->form_title=$request->form_title;
            $page_bar_form->form_sub_title=$request->form_sub_title;
            $page_bar_form->form_primary_button_text=$request->form_primary_button_text;
            $page_bar_form->form_primary_button_link=$request->form_primary_button_link;
            $page_bar_form->form_secondary_button_text=$request->form_secondary_button_text;
            $page_bar_form->form_secondary_button_link=$request->form_secondary_button_link;
            $page_bar_form->form_warning_text=$request->form_warning_text;
            $page_bar_form->form_title_color=$request->form_title_color;
            $page_bar_form->form_sub_title_color=$request->form_sub_title_color;
            $page_bar_form->form_primary_button_color=$request->form_primary_button_color;
            $page_bar_form->form_primary_button_text_color=$request->form_primary_button_text_color;
            $page_bar_form->form_secondary_button_color=$request->form_secondary_button_color;
            $page_bar_form->form_secondary_button_text_color=$request->form_secondary_button_text_color;
            $page_bar_form->form_background_color=$request->form_background_color;
            $page_bar_form->form_close_button_color=$request->form_close_button_color;
            $page_bar_form->form_title_size=$request->form_title_size;
            $page_bar_form->form_title_weight=$request->form_title_weight;
            $page_bar_form->form_sub_title_size=$request->form_sub_title_size;
            $page_bar_form->form_sub_title_weight=$request->form_sub_title_weight;
            $page_bar_form->form_button_text_size=$request->form_button_text_size;
            $page_bar_form->form_button_text_weight=$request->form_button_text_weight;
            $page_bar_form->save();

            $page_bar_success_form=new PageBarSuccessForm();
            $page_bar_success_form->shop_id=$shop->id;
            $page_bar_success_form->page_bar_id=$page_bar->id;
            $page_bar_success_form->success_form_title=$request->success_form_title;
            $page_bar_success_form->success_form_middle_title=$request->success_form_middle_title;
            $page_bar_success_form->success_form_button_enabled=$request->success_form_button_enabled;
            $page_bar_success_form->success_form_button_text=$request->success_form_button_text;
            $page_bar_success_form->success_form_button_link=$request->success_form_button_link;
            $page_bar_success_form->success_form_title_color=$request->success_form_title_color;
            $page_bar_success_form->success_form_button_text_color=$request->success_form_button_text_color;
            $page_bar_success_form->success_form_background_color=$request->success_form_background_color;
            $page_bar_success_form->success_form_middle_title_color=$request->success_form_middle_title_color;
            $page_bar_success_form->save();

            $pricerule = [
                'title' =>$page_bar->discount_code,
                'customer_selection' => 'all',
                'value' => '-'.$page_bar->discount,
                'value_type' => 'percentage',
                'target_type' => "line_item",
                'target_selection' => "all",
                "allocation_method" => "across",
                'starts_at' => Carbon::now(),

            ];

            $priceruleapi = $client->post( '/price_rules.json',
                [
                    'price_rule' => $pricerule
                ]);

            $response = $priceruleapi->getDecodedBody();
            if (isset($response) && !isset($response['errors'])) {

                $page_bar->price_rule_shopify_id=$response['price_rule']['id'];
                $page_bar->save();

                $data1 = [
                    'discount_code' => [
                        'price_rule_id' => $response['price_rule']['id'],
                        'code' => $page_bar->discount_code,
                    ]
                ];

                $discountCode = $client->post('/admin/api/2023-07/price_rules/' . $response['price_rule']['id'] . '/discount_codes.json', $data1);
                $response1 = $discountCode->getDecodedBody();
                if (isset($response) && !isset($response['errors'])) {
                    $page_bar->discount_code_shopify_id= $response1['discount_code']['id'];
                    $page_bar->save();

                    $charge=Charge::where('status','active')->where('shop_id',$shop->id)->latest()->first();
                    $limit=false;
                    $contacts_limit=false;
                    if($charge){
                        $charge->bars_count=$charge->bars_count+1;
                        $charge->save();

                        $plan=Plan::find($charge->plan_id);
                        if($plan){
                            if($charge->bars_count==$plan->bar_count){
                                $limit=true;
                            }
                            if($charge->contacts_count==$plan->contacts_count){
                                $contacts_limit=true;
                            }
                        }
                    }


                    $this->CreateUpdateMetafield($shop);
                    $data = [
                        'message' => 'Data Saved Successfully',
                        'success'=>true,
                        'limit'=>$limit,
                        'contacts_limit'=>$contacts_limit
                    ];
                }

            }


        }catch (\Exception $exception){
            $data=[
                'error'=>$exception->getMessage(),
                'success'=>false
            ];
        }
        return response()->json($data);
    }
    public function UpdateData(Request $request){
        try {
            $shop = getShop($request->get('shopifySession'));
            $client = new Rest($shop->shop, $shop->access_token);
            if($request->id) {
                $page_bar = PageBar::find($request->id);
                if($page_bar) {
                    $page_bar->shop_id = $shop->id;
                    $page_bar->bar_name = $request->bar_name;
                    $page_bar->type = $request->type;
                    $page_bar->discount_code=$request->discount_code;
                    $page_bar->discount=$request->discount;
                    $page_bar->type_ids = $request->type_ids;
                    $page_bar->bar_title = $request->bar_title;
                    $page_bar->bar_title_color = $request->bar_title_color;
                    $page_bar->bar_color = $request->bar_color;
                    $page_bar->bar_scroll = $request->bar_scroll;
                    $page_bar->bar_button_enabled = $request->bar_button_enabled;
                    $page_bar->bar_button_text = $request->bar_button_text;
                    $page_bar->bar_button_color = $request->bar_button_color;
                    $page_bar->bar_button_text_color = $request->bar_button_text_color;
                    $page_bar->bar_close_button_color = $request->bar_close_button_color;
                    $page_bar->bar_title_text_size = $request->bar_title_text_size;
                    $page_bar->bar_title_text_weight = $request->bar_title_text_weight;
                    $page_bar->bar_button_text_size = $request->bar_button_text_size;
                    $page_bar->bar_button_text_weight = $request->bar_button_text_weight;
                    $page_bar->save();
                }


                $page_bar_form = PageBarForm::where('page_bar_id',$request->id)->first();
                if($page_bar_form) {
                    $page_bar_form->shop_id = $shop->id;
                    $page_bar_form->page_bar_id = $page_bar->id;
                    $page_bar_form->form_name_enabled = $request->form_name_enabled;
                    $page_bar_form->form_email_enabled = $request->form_email_enabled;
                    $page_bar_form->form_phone_enabled = $request->form_phone_enabled;

                    if ($request->hasFile('form_image')) {
                        $file = $request->file('form_image');
                        $destinationPath = 'images/';
                        $filename1 = now()->format('YmdHi') . str_replace([' ', '(', ')'], '-', $file->getClientOriginalName());
                        $file->move($destinationPath, $filename1);
                        $filename1 = (asset('images/' . $filename1));
                        $page_bar_form->form_image = $filename1;
                    }
                    $page_bar_form->form_title = $request->form_title;
                    $page_bar_form->form_sub_title = $request->form_sub_title;
                    $page_bar_form->form_primary_button_text = $request->form_primary_button_text;
                    $page_bar_form->form_primary_button_link = $request->form_primary_button_link;
                    $page_bar_form->form_secondary_button_text = $request->form_secondary_button_text;
                    $page_bar_form->form_secondary_button_link = $request->form_secondary_button_link;
                    $page_bar_form->form_warning_text = $request->form_warning_text;
                    $page_bar_form->form_title_color = $request->form_title_color;
                    $page_bar_form->form_sub_title_color = $request->form_sub_title_color;
                    $page_bar_form->form_primary_button_color = $request->form_primary_button_color;
                    $page_bar_form->form_primary_button_text_color = $request->form_primary_button_text_color;
                    $page_bar_form->form_secondary_button_color = $request->form_secondary_button_color;
                    $page_bar_form->form_secondary_button_text_color = $request->form_secondary_button_text_color;
                    $page_bar_form->form_background_color = $request->form_background_color;
                    $page_bar_form->form_close_button_color = $request->form_close_button_color;
                    $page_bar_form->form_title_size = $request->form_title_size;
                    $page_bar_form->form_title_weight = $request->form_title_weight;
                    $page_bar_form->form_sub_title_size = $request->form_sub_title_size;
                    $page_bar_form->form_sub_title_weight = $request->form_sub_title_weight;
                    $page_bar_form->form_button_text_size = $request->form_button_text_size;
                    $page_bar_form->form_button_text_weight = $request->form_button_text_weight;
                    $page_bar_form->save();
                }


                $page_bar_success_form = PageBarSuccessForm::where('page_bar_id',$request->id)->first();
                if($page_bar_success_form) {
                    $page_bar_success_form->shop_id = $shop->id;
                    $page_bar_success_form->page_bar_id = $page_bar->id;
                    $page_bar_success_form->success_form_title = $request->success_form_title;
                    $page_bar_success_form->success_form_middle_title = $request->success_form_middle_title;
                    $page_bar_success_form->success_form_button_enabled = $request->success_form_button_enabled;
                    $page_bar_success_form->success_form_button_text = $request->success_form_button_text;
                    $page_bar_success_form->success_form_button_link = $request->success_form_button_link;
                    $page_bar_success_form->success_form_title_color = $request->success_form_title_color;
                    $page_bar_success_form->success_form_button_text_color = $request->success_form_button_text_color;
                    $page_bar_success_form->success_form_background_color = $request->success_form_background_color;
                    $page_bar_success_form->success_form_middle_title_color = $request->success_form_middle_title_color;
                    $page_bar_success_form->save();
                }

                $pricerule = [
                    'title' =>$page_bar->discount_code,
                    'customer_selection' => 'all',
                    'value' => '-'.$page_bar->discount,
                    'value_type' => 'percentage',
                    'target_type' => "line_item",
                    'target_selection' => "all",
                    "allocation_method" => "across",
                    'starts_at' => Carbon::now(),

                ];

                $priceruleapi = $client->put( '/price_rules/'.$page_bar->price_rule_shopify_id.'.json',

                    [
                        'price_rule' => $pricerule
                    ]);
                $response = $priceruleapi->getDecodedBody();
                if (isset($response) && !isset($response['errors'])) {
                    $this->CreateUpdateMetafield($shop);
                    $data = [
                        'message' => 'Data Updated Successfully',
                        'success' => true
                    ];
                }
            }

        }catch (\Exception $exception){
            $data=[
                'error'=>$exception->getMessage(),
                'success'=>false
            ];
        }
        return response()->json($data);
    }

    public function DeleteData(Request $request){
        try {
            $shop = getShop($request->get('shopifySession'));
            $client = new Rest($shop->shop, $shop->access_token);
            $page_bar=PageBar::find($request->id);
            if($page_bar) {
                $priceruleapi = $client->delete('/price_rules/' . $page_bar->price_rule_shopify_id . '.json');
                $response = $priceruleapi->getDecodedBody();
                if ($response==null) {
                    PageBarSuccessForm::where('page_bar_id', $request->id)->delete();
                    PageBarForm::where('page_bar_id', $request->id)->delete();
                    $page_bar->delete();

                    $charge=Charge::where('status','active')->where('shop_id',$shop->id)->latest()->first();
                    if($charge && $charge->bars_count!=0){
                        $charge->bars_count=$charge->bars_count-1;
                        $charge->save();
                    }

                    $this->CreateUpdateMetafield($shop);
                    $data = [
                        'message' => 'Page Bar Deleted Successfully',
                        'success' => true
                    ];
                }
            }
        }catch (\Exception $exception){
            $data=[
                'error'=>$exception->getMessage(),
                'success'=>false
            ];
        }
        return response()->json($data);
    }

    public function UpdatebarStatus(Request $request){
        try {
            $shop = getShop($request->get('shopifySession'));
            $page_bar = PageBar::find($request->id);
            $page_bar->is_active = $request->is_active;
            $page_bar->save();
            $this->CreateUpdateMetafield($shop);
            $data = [
                'message' => 'Status Updated Successfully',
                'success' => true
            ];
        }catch (\Exception $exception){
            $data=[
                'error'=>$exception->getMessage(),
                'success'=>false
            ];
        }
        return response()->json($data);
    }


    public function CreateUpdateMetafield($session){
        $getdata=array();
        $main_data=array();
        $client = new Rest($session->shop, $session->access_token);

        $page_bars=PageBar::where('is_active',1)->where('shop_id',$session->id)->get();
        $data=null;
        foreach ($page_bars as $page_bar){
            $type_ids=explode(',',$page_bar->type_ids);
            if($page_bar->type=='products'){
                $data=Product::whereIn('id',$type_ids)->pluck('handle')->toArray();
            }elseif ($page_bar->type=='collections'){
                $data=Collection::whereIn('id',$type_ids)->pluck('handle')->toArray();
            }
            elseif ($page_bar->type=='blogs'){
                $data=Blog::whereIn('id',$type_ids)->pluck('handle')->toArray();
            }
            elseif ($page_bar->type=='pages'){
                $data=Page::whereIn('id',$type_ids)->pluck('handle')->toArray();
            }

            $page_bar_form=PageBarForm::where('page_bar_id',$page_bar->id)->where('shop_id',$session->id)->first();
            $page_bar_success_form=PageBarSuccessForm::where('page_bar_id',$page_bar->id)->where('shop_id',$session->id)->first();
            $getdata['type']=$page_bar->type;
            $getdata['handles']=$data;
            $getdata['bar_title']=$page_bar->bar_title;
            $getdata['bar_title_color']=$page_bar->bar_title_color;
            $getdata['bar_color']=$page_bar->bar_color;
            $getdata['bar_scroll']=$page_bar->bar_scroll;
            $getdata['bar_button_enabled']=$page_bar->bar_button_enabled;
            $getdata['bar_button_text']=$page_bar->bar_button_text;
            $getdata['bar_button_color']=$page_bar->bar_button_color;
            $getdata['bar_button_text_color']=$page_bar->bar_button_text_color;
            $getdata['bar_close_button_color']=$page_bar->bar_close_button_color;
            $getdata['bar_title_text_size']=$page_bar->bar_title_text_size;
            $getdata['bar_title_text_weight']=$page_bar->bar_title_text_weight;
            $getdata['bar_button_text_size']=$page_bar->bar_button_text_size;
            $getdata['bar_button_text_weight']=$page_bar->bar_button_text_weight;
            $getdata['form_name_enabled']=$page_bar_form->form_name_enabled;
            $getdata['form_email_enabled']=$page_bar_form->form_email_enabled;
            $getdata['form_phone_enabled']=$page_bar_form->form_phone_enabled;
            $getdata['form_image']=$page_bar_form->form_image;
            $getdata['form_title']=$page_bar_form->form_title;
            $getdata['form_sub_title']=$page_bar_form->form_sub_title;
            $getdata['form_primary_button_text']=$page_bar_form->form_primary_button_text;
            $getdata['form_primary_button_link']=$page_bar_form->form_primary_button_link;
            $getdata['form_secondary_button_text']=$page_bar_form->form_secondary_button_text;
            $getdata['form_secondary_button_link']=$page_bar_form->form_secondary_button_link;
            $getdata['form_warning_text']=$page_bar_form->form_warning_text;
            $getdata['form_title_color']=$page_bar_form->form_title_color;
            $getdata['form_sub_title_color']=$page_bar_form->form_sub_title_color;
            $getdata['form_primary_button_color']=$page_bar_form->form_primary_button_color;
            $getdata['form_primary_button_text_color']=$page_bar_form->form_primary_button_text_color;
            $getdata['form_secondary_button_color']=$page_bar_form->form_secondary_button_color;
            $getdata['form_secondary_button_text_color']=$page_bar_form->form_secondary_button_text_color;
            $getdata['form_background_color']=$page_bar_form->form_background_color;
            $getdata['form_close_button_color']=$page_bar_form->form_close_button_color;
            $getdata['form_title_size']=$page_bar_form->form_title_size;
            $getdata['form_title_weight']=$page_bar_form->form_title_weight;
            $getdata['form_sub_title_size']=$page_bar_form->form_sub_title_size;
            $getdata['form_sub_title_weight']=$page_bar_form->form_sub_title_weight;
            $getdata['form_button_text_size']=$page_bar_form->form_button_text_size;
            $getdata['form_button_text_weight']=$page_bar_form->form_button_text_weight;
            $getdata['success_form_title']=$page_bar_success_form->success_form_title;
            $getdata['success_form_middle_title']=$page_bar_success_form->success_form_middle_title;
            $getdata['success_form_button_enabled']=$page_bar_success_form->success_form_button_enabled;
            $getdata['success_form_button_text']=$page_bar_success_form->success_form_button_text;
            $getdata['success_form_button_link']=$page_bar_success_form->success_form_button_link;
            $getdata['success_form_title_color']=$page_bar_success_form->success_form_title_color;
            $getdata['success_form_button_text_color']=$page_bar_success_form->success_form_button_text_color;
            $getdata['success_form_background_color']=$page_bar_success_form->success_form_background_color;
            $getdata['success_form_middle_title_color']=$page_bar_success_form->success_form_middle_title_color;

       array_push($main_data,$getdata);
        }
        try {
            if ($session->metafield_id == null) {
                $shop_metafield = $client->post('/metafields.json', [
                    "metafield" => array(
                        "key" => 'data',
                        "value" => json_encode($main_data),
                        "type" => "json_string",
                        "namespace" => "PageBar"
                    )
                ]);

            } else {
                $shop_metafield = $client->put('/metafields/' . $session->metafield_id . '.json', [
                    "metafield" => [
                        "value" => json_encode($main_data)
                    ]
                ]);

            }

            $response = $shop_metafield->getDecodedBody();
            if (isset($response) && !isset($response['errors'])) {
                $session->metafield_id = $response['metafield']['id'];
                $session->save();
            }
        } catch (\Exception $exception) {

        }
    }

}
