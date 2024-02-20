<?php

namespace App\Jobs;

use App\Http\Controllers\CollectionController;
use App\Http\Controllers\OrderController;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class OrderWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $data;
    public $shop;
    public $timeout = 100000;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($data,$shop)
    {
        $this->data=$data;
        $this->shop=$shop;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $order=$this->data;
        $shop=$this->shop;

        $orderController=new OrderController();
        $orderController->createUpdateOrder($order,$shop);
    }
}
