Vue.component('cart-block', {
	props:[
		'external_data',
		'internal_data',
	],
	data() {
		return {
			show_popup: false,
		};
	},
	template: `
	<div class="cart-block">
		<cart-widget :count="external_data.count"  @click.native="internal_data.show_popup=!internal_data.show_popup"></cart-widget>
		<cart-popup :internal_data="internal_data" :external_data="external_data" v-if="internal_data.show_popup"></cart-popup>
	</div>
	`,
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
		<div class="cart-count">Sepetinizde {{external_data.count}} ürün var.</div>
		<cart-item class="cart-item added-item" v-if="internal_data.added_item.exists" :item="internal_data.added_item"></cart-item>
		<cart-item v-for="item in external_data.items" :key="item.id" :item="item"></cart-item>
		<div class="cart-popup-footer">
			<cart-total class="cart-total" :total="external_data.total"></cart-total>
			<button class="cart-button button is-primary">Sepete git</button>
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
		<div class="thumb-image"><img :src="item.image"></div>
		<div class="product">{{item.product}}</div>
		<div class="attributes">
			<div class="attr" v-for="attr in item.attributes" :key="attr.id">{{attr.label}} {{attr.text}}</div>
		</div>
		<div class="item-price">{{item.price}} {{item.currency}}</div>
	</div>
	`,
});
Vue.component('cart-total', {
	props:[
		'total',
	],
	template: `
	<div>
		<div class="left">
			<div class="total">Toplam</div>
			<div class="tax-included">KDV Dahil</div>
			<div class="shipment">{{shipment}}</div>
		</div>
		<div class="right">{{total.price}} {{total.currency}}</div>
	</div>
	`,
	computed: {
    	shipment: function () {
    		if(this.total.shipment == 0){
      			return "Kargo bedava";
    		} else{
    			return "Kargo: " + this.total.shipment + this.total.currency;
    		}
    	}
  	},
});
var vue_cart = new Vue({
	el: '#cart-block',
	data: {
		"internal_data": {
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
			"count": "3",
			"total": {
				"price": 59.90,
				"currency": "TRY",
				"shipment": 0,
			},
	    	"items": [
	    		{
		    		"image": "http://v2.bidolubaski.com/sites/default/files/styles/cart_block_thumbnail_80x80/public/default_images/ozel-urun_1.jpg", 
		    		"product": "title1", 
		    		"price": 11.90,
		    		"currency": "TRY",
		    		"attributes": [
		      			{ "label": "ebat", "text": "1x1cm" },
		      			{ "label": "kagit", "text": "110gr" },
		    		]
	    		},
	            {
		    		"image": "http://v2.bidolubaski.com/sites/default/files/styles/cart_block_thumbnail_80x80/public/default_images/ozel-urun_1.jpg", 
		    		"product": "title2", 
		    		"price": 21.90,
		    		"currency": "TRY",
		    		"attributes": [
		      			{ "label": "ebat", "text": "2x2cm" },
		      			{ "label": "kagit", "text": "130gr" },
		    		]
	    		},
	    		{
		    		"image": "http://v2.bidolubaski.com/sites/default/files/styles/cart_block_thumbnail_80x80/public/default_images/ozel-urun_1.jpg", 
		    		"product": "title3", 
		    		"price": 31.90,
		    		"currency": "TRY",
		    		"attributes": [
		      			{ "label": "ebat", "text": "3x3cm" },
		      			{ "label": "kagit", "text": "170gr" },
		    		]
	    		},
	    	]
	    },
  	},
  	methods:{
  		incrementCount(){
  			this.external_data.count ++;
  		},
  	},
})