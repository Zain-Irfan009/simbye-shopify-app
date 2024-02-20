<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Shopify\Clients\Rest;

class BlogController extends Controller
{
    public function BlogsSync(Request $request){
        $shop = getShop($request->get('shopifySession'));
        $this->syncBlogs($shop);
    }

    public function syncBlogs($session, $nextPage = null)
    {
        $client = new Rest($session->shop, $session->access_token);
        $result = $client->get('blogs', [], [
            'limit' => 250,
            'page_info' => $nextPage,
        ]);
        $blogs = $result->getDecodedBody()['blogs'];
        foreach ($blogs as $blog) {
            $this->createUpdateBlog($blog, $session);
        }
        if (isset($result)) {
            if ($result->getPageInfo() ? true : false) {
                $nextUrl = $result->getPageInfo()->getNextPageUrl();
                if (isset($nextUrl)) {
                    $arr = explode('page_info=', $result->getPageInfo()->getNextPageUrl());
                    $this->syncBlogs($arr[count($arr) - 1]);
                }
            }
        }
    }


    public function createUpdateBlog($blog, $shop)
    {
        $blog = json_decode(json_encode($blog), false);
        $b = Blog::where([
            'shop_id' => $shop->id,
            'shopify_id' => $blog->id
        ])->first();
        if ($b === null) {
            $b = new Blog();
        }

        $b->shopify_id = $blog->id;
        $b->shop_id = $shop->id;
        $b->title = $blog->title;
        $b->handle = $blog->handle;
        $b->tags = $blog->tags;
        $b->commentable = $blog->commentable;
        $b->feedburner = $blog->feedburner;
        $b->feedburner_location = $blog->feedburner_location;
        $b->save();
    }
}
