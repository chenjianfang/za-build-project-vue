import Vue from 'vue';
import App from './app';
import './index.css';
const aa  = 1;
console.log(aa);

new Vue({
    el: '#app',
    render: h => h(App)
});
