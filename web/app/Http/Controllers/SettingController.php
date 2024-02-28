<?php

namespace App\Http\Controllers;

use App\Models\MailSmtpSetting;
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
            $setting->email_service_status=$request->email_service_status;
            $setting->status=$request->status;
            $setting->save();
           }
        $data = [
            'message' => 'Setting Saved Successfully',
            'data' => $setting
        ];
        return response()->json($data);
    }

    public function MailSmtp(Request $request){
        $shop = getShop($request->get('shopifySession'));
        if($shop) {
            $mail_smtp = MailSmtpSetting::where('shop_id', $shop->id)->first();
            if ($mail_smtp) {
                $data = [
                    'data' => $mail_smtp
                ];
                return response()->json($data);
            }
        }
    }
    public function MailSmtpSettingSave(Request $request){
        $shop = getShop($request->get('shopifySession'));
        if($shop){
            $mail_smtp=MailSmtpSetting::where('shop_id',$shop->id)->first();

            if($mail_smtp==null){
                $mail_smtp=new MailSmtpSetting();
            }

            $mail_smtp->shop_id=$shop->id;
            $mail_smtp->smtp_host=$request->smtp_host;
            $mail_smtp->smtp_username=$request->smtp_username;
            $mail_smtp->smtp_password=$request->smtp_password;
            $mail_smtp->email_from=$request->email_from;
            $mail_smtp->from_name=$request->from_name;
            $mail_smtp->reply_to=$request->reply_to;
            $mail_smtp->smtp_type=$request->smtp_type;
            $mail_smtp->smtp_port=$request->smtp_port;
            $mail_smtp->save();

            $data = [
                'message' => 'Mail SMTP Added Successfully',
                'data' => $mail_smtp
            ];
            return response()->json($data);
        }

    }
}
