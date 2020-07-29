<template>
    <div id="customers">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="float-left">Customers</h4>
                        <span class="float-right">
                            <a class="btn btn-primary" @click="create()">Add Customer <i class="fas fa-user"></i>+</a>
                            <a href="" class="btn btn-primary" @click="reload()">Reload </a>
                        </span>
                    </div>
                    <div class="card-body">
                        <div class="md-3">
                           <div class="row">
                               <div class="col-md-2"><strong>Search By:</strong></div>
                               <div class="col-md-3">
                                   <select v-model="queryField" name="" id="fields" class="form-control">
                                       <option value="name">Name</option>
                                       <option value="email">Email</option>
                                       <option value="address">Address</option>
                                   </select>
                               </div>
                               <div class="col-md-7">
                                   <input v-model="query" type="text" name="search" class="form-control" placeholder="Search...">
                               </div>
                           </div>
                        </div>
                        <table class="table table-bordered table-striped mt-2">
                            <thead>
                            <tr>
                                <th scope="col">SL No</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email Address</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Address</th>
                                <th scope="col">Total</th>
                                <th scope="col" class="text-center">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-show="customers.length" v-for="(customer,index) in customers" :key="customer.id">
                                    <td scope="row">{{index + 1}}</td>
                                    <td>{{customer.name}}</td>
                                    <td>{{customer.email}}</td>
                                    <td>{{customer.phone}}</td>
                                    <td>{{customer.address}}</td>
                                    <td>{{customer.total}}</td>
                                    <td class="btn-group">
                                        <button class="btn btn-info btn-sm">View</button>
                                        <button class="btn btn-primary btn-sm" @click="edit(customer)">Edit</button>
                                        <button class="btn btn-danger btn-sm" @click="destroy(customer)">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                            <tr v-show="!customers.length">
                                <td colspan="7" class="alert alert-danger">
                                    Seach not found.
                                </td>
                            </tr>
                        </table>
                        <pagination v-if="pagination.last_page >1" :pagination="pagination" :offset="5" @paginate="query===''?getData():searchData()">
                        </pagination>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{editMode ?"Edit ":"Add New "}}Customer</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="editMode ? update() : store() " @keydown="form.onKeydown($event)">
                        <div class="modal-body">
                            <alert-error :form="form"></alert-error>
                            <div class="form-group">
                                <label>Name</label>
                                <input v-model="form.name" type="text" name="name"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input v-model="form.email" type="text" name="email"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Phone</label>
                                <input v-model="form.phone" type="text" name="phone"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('phone') }">
                                <has-error :form="form" field="phone"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Address</label>
                                <textarea v-model="form.address" type="text" name="address"
                                          class="form-control" :class="{ 'is-invalid': form.errors.has('address') }" cols="30" rows="3"></textarea>
                                <has-error :form="form" field="address"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Total</label>
                                <input v-model="form.total" type="number" name="total"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('total') }">
                                <has-error :form="form" field="total"></has-error>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button :disabled="form.busy" type="submit" class="btn btn-primary">Save changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <vue-progress-bar></vue-progress-bar>
        <vue-snotify></vue-snotify>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                editMode: false,
                query: '',
                queryField:'name',
                customers:[],
                form : new Form({
                    id : '',
                    name : '',
                    email : '',
                    phone : '',
                    address : '',
                    total : ''
                }),
                pagination:{
                    current_page:1,
                },

            }
        },
        watch: {
            query:function (newQ,old) {
                if(newQ===''){
                    this.getData()
                }
                else
                {
                    this.searchData()
                }
            }
        },
        mounted() {
            console.log('Component mounted.')
            this.getData();
        },
        methods: {
            getData(){
                this.$Progress.start()
                axios.get('/dataview/public/api/customers?page='+this.pagination.current_page)
                    .then(response=>{
                        this.customers = response.data.data
                        this.pagination = response.data.meta
                        this.$Progress.finish()
                    })
                    .catch(e=>{
                        console.log(e)
                        this.$Progress.fail()
                    })
            },
            searchData(){
                this.$Progress.start()
                axios.get('/dataview/public/api/search/customers/'+this.queryField+'/'+this.query+'?page='+this.pagination.current_page)
                .then(response =>{
                    this.customers = response.data.data
                    this.pagination = response.data.meta
                    this.$Progress.finish()
                })
                .catch(e=>{
                    console.log(e)
                    this.$Progress.fail()
                })

            },
            reload(){
                this.getData()
                this.query =''
                this.queryField = 'name'
                this.$snotify.success('Data Successfully Refresh','Success')
            },
            create(){
                this.editMode = false;
                this.form.reset()
                this.form.clear()
                $('#exampleModal').modal('show');
            },
            store(){
                this.$Progress.start()
                this.form.busy = true
                this.form.post('/dataview/public/api/customers')
                    .then(response =>{
                        this.getData()
                        $('#exampleModal').modal('hide');
                        if(this.form.successful){
                            this.$Progress.finish()
                            this.$snotify.success('Customer Info Successfully Saved','Success')
                        }else{
                            this.$Progress.fail()
                            this.$snotify.error('Something went wrong try again later','Error')
                        }
                    })
                .catch(e=>{
                    this.$Progress.fail()
                    console.log(e)
                })
            },
            edit(customer){
                this.editMode = true;
                this.form.reset();
                this.form.clear();
                this.form.fill(customer);
                $('#exampleModal').modal('show');
            },
            update(){
                this.$Progress.start()
                this.form.busy = true
                this.form.put('/dataview/public/api/customers/'+this.form.id)
                    .then(response =>{
                        this.getData()
                        $('#exampleModal').modal('hide');
                        if(this.form.successful){
                            this.$Progress.finish()
                            this.$snotify.success('Customer Info Successfully Updated','Success')
                        }else{
                            this.$Progress.fail()
                            this.$snotify.error('Something went wrong try again later','Error')
                        }
                    })
                    .catch(e=>{
                        this.$Progress.fail()
                        console.log(e)
                    })
            },
            destroy(customer){
                this.$snotify.clear()
                this.$snotify.confirm("You will not be able to recover this data!", 'Are you sure?', {
                    showProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    buttons: [
                        {text: 'Yes', action: toast=>{
                            this.$snotify.remove(toast.id);
                            this.$Progress.start()
                            axios.delete('/dataview/public/api/customers/'+customer.id)
                                .then(response=>{
                                    this.getData();
                                    this.$Progress.finish();
                                    this.$snotify.success(
                                        'Customer Successfully Deleted','Sucess'
                                    )
                                })
                                .catch(e=>{
                                    this.$Progress.fail()
                                    console.log(e)
                                })
                            },
                         bold: true
                        },
                        {text: 'No', action: toast=>{
                            this.$snotify.remove(toast.id);
                        }
                        },
                    ]
                });
            }
        },
    }
</script>
