/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

//window.Vue = require('vue');
import Vue from 'vue'
import {Form,HasError,AlertError} from 'vform'
import VueProgressBar from 'vue-progressbar'
import Snotify, { SnotifyPosition } from 'vue-snotify'
window.Form = Form
const Snotifyoptions = {
    toast: {
        position: SnotifyPosition.rightTop
    }
}

Vue.use(Snotify, Snotifyoptions)

const VueProgressBarOptions = {
    color: '#50d38a',
    failedColor: '#874b4b',
    thickness: '5px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
}

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('customer-component', require('./components/CustomerComponent.vue').default);
Vue.component('pagination', require('./components/partial/PaginationComponent').default);
Vue.use(VueProgressBar, VueProgressBarOptions)

Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
});
