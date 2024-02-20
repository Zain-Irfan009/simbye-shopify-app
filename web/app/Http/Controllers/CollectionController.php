<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Session;
use Illuminate\Http\Request;
use Shopify\Clients\Rest;

class CollectionController extends Controller
{
    public function CollectionsSync(Request $request){
        $shop = getShop($request->get('shopifySession'));
        $this->SyncCollectionCustom($shop);
        $this->SyncCollectionSmart($shop);
    }

    public function SyncCollectionCustom($session, $nextPage = null){
        $client = new Rest($session->shop, $session->access_token);
        $result = $client->get('custom_collections', [], [
            'limit' => 250,
            'page_info' => $nextPage,
        ]);
        $collections = $result->getDecodedBody()['custom_collections'];
        foreach ($collections as $collection) {
            $this->SingleCollection($collection, $session);
        }
        if (isset($result)) {
            if ($result->getPageInfo() ? true : false) {
                $nextUrl = $result->getPageInfo()->getNextPageUrl();
                if (isset($nextUrl)) {
                    $arr = explode('page_info=', $result->getPageInfo()->getNextPageUrl());
                    $this->SyncCollectionCustom($arr[count($arr) - 1]);
                }
            }
        }
    }
    public function SyncCollectionSmart($session, $nextPage = null){
        $client = new Rest($session->shop, $session->access_token);
        $result = $client->get('smart_collections', [], [
            'limit' => 250,
            'page_info' => $nextPage,
        ]);
        $collections = $result->getDecodedBody()['smart_collections'];
        foreach ($collections as $collection) {
            $this->SingleCollection($collection,$session);
        }
        if (isset($result)) {
            if ($result->getPageInfo() ? true : false) {
                $nextUrl = $result->getPageInfo()->getNextPageUrl();
                if (isset($nextUrl)) {
                    $arr = explode('page_info=', $result->getPageInfo()->getNextPageUrl());
                    $this->SyncCollectionSmart($arr[count($arr) - 1]);
                }
            }
        }
    }

    public function SingleCollection($collection, $shop)
    {
        $collection = json_decode(json_encode($collection), false);
        $new_collection = Collection::where('shopify_id', $collection->id)->where('shop_id', $shop->id)->first();
        if ($new_collection == null) {
            $new_collection = new Collection();
        }
        $image=null;
        if(isset($collection->image)){
            $image=$collection->image->src;
        }
        $new_collection->shopify_id = $collection->id;
        $new_collection->handle = $collection->handle;
        $new_collection->title = $collection->title;
        $new_collection->body_html = $collection->body_html;
        $new_collection->sort_order = $collection->sort_order;
        $new_collection->image = $image;
        $new_collection->shop_id = $shop->id;
        $new_collection->save();

    }
}
