<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class CustomerCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'data'=>$this->collection->map(function ($item){
                return [
                    'id'=>$item->id,
                    'name'=>$item->name,
                    'email'=>$item->email,
                    'phone'=>$item->phone,
                    'address'=>$item->address,
                    'total'=>$item->total,
                ];
        })];
        //parent::toArray($request);
    }
}
