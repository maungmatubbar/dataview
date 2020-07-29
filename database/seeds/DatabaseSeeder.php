<?php

use Illuminate\Database\Seeder;
use App\Customer;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        factory(Customer::class,100)->create();
    }
}
