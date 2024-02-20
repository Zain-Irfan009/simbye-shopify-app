<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Shopify\Clients\Rest;

class PageController extends Controller
{
    public function PagesSync(Request $request){
        $shop = getShop($request->get('shopifySession'));
        $this->syncPages($shop);
    }

    public function syncPages($session, $nextPage = null)
    {
        $client = new Rest($session->shop, $session->access_token);
        $result = $client->get('pages', [], [
            'limit' => 250,
            'page_info' => $nextPage,
        ]);
        $pages = $result->getDecodedBody()['pages'];
        foreach ($pages as $page) {
            $this->createUpdatePage($page, $session);
        }
        if (isset($result)) {
            if ($result->getPageInfo() ? true : false) {
                $nextUrl = $result->getPageInfo()->getNextPageUrl();
                if (isset($nextUrl)) {
                    $arr = explode('page_info=', $result->getPageInfo()->getNextPageUrl());
                    $this->syncPages($arr[count($arr) - 1]);
                }
            }
        }
    }


    public function createUpdatePage($page, $shop)
    {
        $page = json_decode(json_encode($page), false);
        $p = Page::where([
            'shop_id' => $shop->id,
            'shopify_id' => $page->id
        ])->first();
        if ($p === null) {
            $p = new Page();
        }

        $p->shopify_id = $page->id;
        $p->shop_id = $shop->id;
        $p->shopify_shop_id = $page->shop_id;
        $p->handle = $page->handle;
        $p->title = $page->title;
        $p->body_html = $page->body_html;
        $p->author = $page->author;
        $p->save();
    }
}
