var order_id = document.querySelector('.order-id-for-vue').innerHTML;
document.querySelector('#cart-block').children[0].setAttribute(":order_id", order_id);

var full = window.location.host;
var parts = full.split('.');
var subdomain = parts[0];

Vue.component('cart-block', {
	props:[
		'external_data',
		'internal_data',
		'order_id'
	],
	data() {
		return {
			show_popup: false,
		};
	},
	template: `
	<div class="cart-block">
		<cart-widget :count="internal_data.count"  @click.native="internal_data.show_popup=!internal_data.show_popup"></cart-widget>
		<cart-popup :internal_data="internal_data" :external_data="external_data" v-if="internal_data.show_popup"></cart-popup>
	</div>
	`,
	created: function () {
		this.$parent.order_id = this.order_id;
  	},
});
Vue.component('cart-widget', {
	props:[
		'count',
	],
	template: `
	<div class="cart-widget">
		<span class="cart-count">{{count}}</span><span class="my-cart">Sepetim</span>
	</div>
	`,
});
Vue.component('cart-popup', {
	props:[
		'internal_data',
		'external_data',
	],
	template: `
	<div class="cart-popup">
		<button class="cart-close" @click="$parent.internal_data.show_popup = false">X</button>
		<div class="cart-count">Sepetinizde {{internal_data.count}} ürün var.</div>
		<cart-item class="cart-item added-item" v-if="internal_data.added_item.exists" :item="internal_data.added_item"></cart-item>
		<cart-item v-for="item in external_data.items" :key="item.id" :item="item"></cart-item>
		<div class="cart-popup-footer">
			<cart-total class="cart-total" :first_item="external_data.items[0].total_price__number_1"></cart-total>
			<a class="cart-button button is-primary" href="/cart">Sepete git</a>
		</div>
	</div>
	`,
});
Vue.component('cart-item', {
	props:[
		'item',
	],
	template: `
	<div class="cart-item">
		<div class="thumb-image"><img :src="item.field_product_image"></div>
		<div class="product">{{item.title}}</div>
		<div class="item-price">{{item.price__number}}</div>
	</div>
	`,
});
Vue.component('cart-total', {
	props:[
		'first_item',
	],
	template: `
	<div>
		<div class="left">
			<div class="total">Toplam</div>
			<div class="tax-included">KDV Dahil</div>
			<div class="shipment">{{shipment}}</div>
		</div>
		<div class="right">{{first_item}}</div>
	</div>
	`,
	computed: {
    	shipment: function () {
      			return "Kargo bedava";
    	}
  	},
});
var vue_cart = new Vue({
	el: '#cart-block',
	data: {
		"order_id": null,
		"internal_data": {
			"count": null,
			"show_popup": false,
			"added_item": {
				"exists": false,
	    		"image": "http://v2.bidolubaski.com/sites/default/files/styles/cart_block_thumbnail_80x80/public/default_images/ozel-urun_1.jpg", 
	    		"product": "", 
	    		"price": 0,
	    		"currency": "",
	    		"attributes": []
	    	},
		},
		"external_data": {
			"items": []
	    },
  	},
  	mounted() {
  		var self = this;
  		url = 'https://'+subdomain+'.iyibaski.com/cart/'+this.order_id+'/cart.json';
  		axios.get(url)
  		.then(function (response) {
    		vue_cart.external_data.items = response.data;
    		vue_cart.internal_data.count = vue_cart.external_data.items.length;
  		})
  		.catch(function (error) {
    		console.log(error);
  		});
  	},
  	methods:{
  		incrementCount(){
  			this.external_data.count ++;
  		},
  	},
})