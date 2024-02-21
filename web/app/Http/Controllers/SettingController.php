<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function Setting(Request $request){
        $shop = getShop($request->get('shopifySession'));
        if($shop) {
            $setting = Setting::where('shop_id', $shop->id)->first();
            if ($setting) {
                $data = [
                    'data' => $setting
                ];
                return response()->json($data);
            }
        }
    }

    public function SettingSave(Request $request){
        $shop = getShop($request->get('shopifySession'));
        if($shop) {
            $setting = Setting::where('shop_id', $shop->id)->first();
            if($setting==null){
                $setting=new Setting();
            }
            $setting->shop_id=$shop->id;
            $setting->access_code=$request->access_code;
            $setting->status=$request->status;
            $setting->save();
           }
        $data = [
            'message' => 'Setting Saved Successfully',
            'data' => $setting
        ];
        return response()->json($data);
    }
}
