<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\Session;
use App\Models\Setting;
use Illuminate\Console\Command;
use Shopify\Clients\Rest;

class UpdateEsimOrderStatusCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'esim:cron';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $shop=Session::first();
        $client = new Rest($shop->shop, $shop->access_token);
      $orders=Order::where('smtp_status',0)->get();
        $setting=Setting::where('shop_id',$shop->id)->first();
        if($setting && $setting->status==1) {
            foreach ($orders as $order) {
                if ($order->esim_all_profile){
                    $esim_data_list = json_decode($order->esim_all_profile);
                $flag = 0;
                foreach ($esim_data_list as $list) {
                    if ($list->smdpStatus == 'RELEASED') {
                        $flag = 1;
                        break;
                    }
                }
                if ($flag == 1) {
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
                                        "key" => 'esimaccess_details',
                                        "value" => json_encode($esim_list),
                                        "type" => "json_string",
                                        "namespace" => "Simbye",

                                    ]
                            ];
                            $order_metafield = $client->post('/orders/' . $order->shopify_id . '/metafields.json', $metafield_data);
                            $order_metafield = $order_metafield->getDecodedBody();

                            if (isset($order_metafield) && !isset($order_metafield['errors'])) {

                            }
                        }
                    }
                } else {
                    $order->smtp_status = 1;
                    $order->save();
                }
            }
        }
        }

    }
}
