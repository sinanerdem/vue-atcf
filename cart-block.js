Vue.component('cart-block', {
	props:[
		'external_data',
		'internal_data',
	],
	data() {
		return {
			show_popup: true,
		};
	},
	template: `
	<div class="cart-block">
		<cart-widget :number="external_data.number" @click.native="show_popup=!show_popup"></cart-widget>
		<cart-popup :external_data="external_data" v-if="show_popup"></cart-popup>
	</div>
	`,
	computed: {
    	discountedPrice: function () {
      	},
  	},
});
Vue.component('cart-widget', {
	props:[
		'number',
	],
	template: `
	<div class="cart-widget">
		<span class="cart-number">{{number}}</span><span class="my-cart">Sepetim</span>
	</div>
	`,
	computed: {
    	discountedPrice: function () {
      	},
  	},
});
Vue.component('cart-popup', {
	props:[
		'external_data',
	],
	template: `
	<div class="cart-popup">
		<div class="cart-number">Sepetinizde {{external_data.number}} ürün var.</div>
		<cart-item v-for="item in external_data.items" :key="item.id" :item="item"></cart-item>
		<cart-total :total="external_data.total"></cart-total>
		<button class="cart-button button is-primary">Sepete git</button>
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
		<div class="attr" v-for="attr in item.attributes" :key="attr.id">{{attr.label}} {{attr.text}}</div>
		<div class="item-price">{{item.price}}</div>
	</div>
	`,
});
Vue.component('cart-total', {
	props:[
		'total',
	],
	template: `
	<div class="cart-total">
		<div class="cart-total-number">{{total}}</div>
	</div>
	`,
});
var vm = new Vue({
	el: '#cart-block',
	data: {
		"internal_data": {

		},
		"external_data": {
			"number": "1",
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
  	computed: {
    	storeRestDecl: function () {
      		return this.internal_data.restriction_declarations;
    	},
  	},
  	methods:{
  		renameSelected(){

  		},
  	},
  	created: function () {

  	},
})