window.EventBus = new Vue({});

// =============================================================================
// Helper Functions
// =============================================================================

// Post Form Data
function sendData(data) {
console.log(data);
  var XHR = new XMLHttpRequest();
  var FD  = new FormData();

  // Push our data into our FormData object
  for(name in data) {
    FD.append(name, data[name]);
  }

  // Define what happens on successful data submission
  XHR.addEventListener('load', function(event) {
    alert('Urun basariyla sepete eklendi!');
  });

  // Define what happens in case of error
  XHR.addEventListener('error', function(event) {
    alert('Gonderim hatasi. Site yoneticileriyle iletisime geciniz.');
  });

  // Set up our request
  XHR.open('POST', 'http://v2.bidolubaski.com/order-create');

  // Send our FormData object; HTTP headers are set automatically
  XHR.send(FD);
}


// Reorganize the selectors inside external data - in place
// Runs once when starting
function organizeSelectors(obj){
	var selectors = obj.external_data.product.selectors;
	obj.external_data.product["single_valued_elements"] = [];
	obj.external_data.product["selector_quantity"] = {};
	for (var i=0; i<selectors.length; i++){
		var len = selectors[i].opts.length;
		// Element doesnt have any opts
		if (len < 1){
			throw new Error('Empty element: '+ selectors[i].label);
			continue;
		}
		// Element is single -> Move it to single_valued_elements
		if (len == 1){
			selectors[i].selector = "atcf-single";
			obj.external_data.product["single_valued_elements"].push(selectors[i]);
			obj.external_data.product.selectors.splice(i, 1);
			i--;
			continue;
		} 
		// Element is smart-element
		if (selectors[i].selector == "atcf-smart"){
			if (len == 2){
				selectors[i].selector = "atcf-radio";
			} else{
				selectors[i].selector = "atcf-select";
			}
		}
	}
};

/*
// Clears all disableds UNDER specified level
function clearAll(selectors,level){
	for (var i = level, len = selectors.length; i < len; i++) {
		for (var k=0, len2 = selectors[i].opts.length; k < len2; k++){
			Vue.set(selectors[i].opts[k], "disabled", false);
		}
	}
};
*/

// Rebuilds restrictions object with the declarations
function rebuildRestrictions(t,selectors){
	var arr = [];
	for (i in selectors){
		arr[i] = {};
	}
	for (i=0; i < t.restriction_declarations.length; i++){
		for(j in t.restriction_declarations[i]){
			for(k in t.restriction_declarations[i][j]){
				var val= t.restriction_declarations[i][j][k];
				arr[j][val]=true;
			}
		}
	}
	return arr;
}

// CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
// Components
// CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
Vue.component('atcf-text', {
	props: [
		'element',
	],
	data() {
		return {
			value: '',
		};
	},
	template: `
	<div class="atcf-text">
		<span class="element-label">{{element.label}}<span class="info-icon">i</span></span>
		<input type="text" name="element.label" v-model="value">
	</div>
	`,
});
// CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
Vue.component('atcf-single', {
	props: [
		'element',
	],
	template: `
	<div class="atcf-single">
		<span class="element-label">{{element.label}}<span class="info-icon">i</span></span>
		<!-- <span class="info-icon" v-tooltip="element.info_text">i</span> -->
		<span class="text">{{element["opts"][0]["text"]}}</span>

	</div>
	`,
});
// CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
Vue.component('atcf-selector', {
	props: [
		'element',
		'disabled_opts',
	],
	data() {
		return {
			selected: this.element.opts[0].value,
			element_index: 0,
			inner_class: "",
			outer_class: "",
		};
	},
	template: `
	<div class="atcf-selector clearfix" :class="outer_class">
		<div class ="selector-inner" :class="inner_class">
			<span class="element-label">{{element.label}}<span class="info-icon">i</span></span>

			<div :class="element.selector" class="actual-selector">

				<form action="" v-if="element.selector == 'atcf-radio'">
					<label 
						v-for="(opt,index) in element.opts" :key="index">
						<input type="radio" 
						@click="element_index=index" 
						v-model="selected" 
						:name="element.level" 
						:disabled="opt.disabled" 
						:value="opt.value">
					{{ opt.text }}</label>
				</form>

				<select v-if="element.selector == 'atcf-select'" @change="element_index=$event.target.selectedIndex" v-model="selected">
					<option 
						v-for="(opt,index) in element.opts" 
						:key="index" 
						:value="opt.value" 
						:disabled="opt.disabled">
					{{ opt.text }}</option>
				</select>
			</div>
			<div class="show-if-no-options">Yukarıdaki seçimlerle bu özellik sunulmaz</div>
		</div>
	</div>
	`,
  	methods: {
  		announce_info() {
		    Vue.set(this.$root.selected_options, this.element.level, this.selected);
			Vue.set(this.$root.restriction_declarations, this.element.level, this.element.opts[this.element_index].limitOthers);
			
			// Set quantity changes if any
			if(this.element.opts[this.element_index].quantities){
				this.$root.quantities = this.element.opts[this.element_index].quantities;
			} else{
				this.$root.quantities = this.$root.initial_quantities;
			}
			if(this.selected == null){
				Vue.set(this.$root.restriction_declarations, this.element.level, null);
			}

			// Emit a global event to signal there is a change
			EventBus.$emit('element-changed',this.element.level);
  		}
  	},
  	mounted: function (){
  		this.announce_info();
  	},
	watch: {
    	selected: {
    		handler: function() {
    			this.announce_info();
    		},
    	},
    	disabled_opts: {
    		handler: function() {
    			for (var i=0; i < this.element.opts.length; i++){
    					Vue.set(this.element.opts[i], "disabled", false);
    			}
    			// look at the disabled opts and disable relevant option accordingly
    			for (var i=0; i < this.element.opts.length; i++){
    				if(this.disabled_opts[this.element.opts[i].value]){
    					Vue.set(this.element.opts[i], "disabled", true);
    				}
    			}
    			////////////////// Disabled opts -> Enabled opt olursa:
    			/*
    			// look at the disabled opts and disable relevant option accordingly
    			if(Object.keys(this.disabled_opts).length){
    				for (var i=0; i < this.element.opts.length; i++){
    					if(this.disabled_opts[this.element.opts[i].value]){
    						Vue.set(this.element.opts[i], "disabled", false);
    					} else{
    						Vue.set(this.element.opts[i], "disabled", true);
    					}
    				}
    			}
    			*/
    		},
    	},
    	element: {
    		handler: function() {
    			// If current selection is disabled, set selected to another available value
    			if (this.element.opts[this.element_index].disabled){

    				//Animate
    				var t = this;
    				t.outer_class = "animate";
    				setTimeout(function(){ t.outer_class = ""; }, 2000);


    				var n_a = true;
    				for (var i = 0; i<this.element.opts.length; i++){
						if (!this.element.opts[i].disabled){
			    			this.selected = this.element.opts[i].value;
							this.element_index = i;
							n_a = false;
							i = this.element.opts.length; // to break the for
			    		}	
			    	}
			    	if (n_a == true){
			    		this.inner_class = "no-options";
			    		this.selected = null;
			    	}
			    } else{
			    	this.inner_class = "";
			    	this.selected = this.element.opts[this.element_index].value;
			    }
			},    
      		deep: true
    	},
	},
});
// CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
Vue.component('atcf-radio-quantity', {
	props: [
		'quantities',
		'prices',
	],
	data() {
		return {
			selected: this.quantities[0],
			element_index: 0,
		};
	},
	template: `
	<div class="quantity-inside">
		
		<form action="">
			<label 
				v-for="(opt,index) in quantities" :key="index">
				<input type="radio" 
				@click="element_index=index" 
				v-model="selected" 
				name="quantities" 
				:disabled="opt.disabled" 
				:value="opt">
			{{ opt }} Adet<br />
			{{prices[opt]}} TL</label>
		</form>

	</div>
	`,
  	methods: {
  		announce_info() {
		    this.$root.selected_quantity = this.selected;
  		}
  	},
  	mounted: function (){
  		this.announce_info();
  	},
	watch: {
    	selected: {
    		handler: function() {
    			this.announce_info();
    		},
    	},
    	quantities: {
    		handler: function() {
    			this.selected= this.quantities[0];
			},    
      		deep: true
    	},
	},
});
// CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
Vue.component('atcf-price', {
	props: [
		'selected_variation',
	],
	template: `
	<div class="atcf-price">
		<div class="base-price">Fiyat: {{selected_variation.price}} +KDV</div>
		<div class="discount">{{selected_variation.discount}} indirimli fiyat: {{this.discountedPrice}}</div>
		<div class="total-price">Toplam fiyat: {{selected_variation.total_price}} KDV dahil</div>
		<div class="sku">{{sku}}</div>
	</div>
	`,
	computed: {
		sku: function (){
    		for (var i in this.selected_variation) {
        		if (this.selected_variation.hasOwnProperty(i)) {
            		return i;
        		}
    		}
		},
    	discountedPrice: function () {
      		return this.selected_variation.price - (this.selected_variation.price * this.selected_variation.discount_percentage / 100);
    	},
  	},
});
// CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
Vue.component('atcf-add-to-cart-button', {
	props: [
		'selected_variation',
	],
	data() {
		return {
			element_disabled: false,
			element_text: "Sepete ekle",
		};
	},
	template: `
		<div class="add-to-cart-button">
			<button class="button is-primary" :disabled="this.element_disabled ? true : null" @click="onClick()">{{element_text}}</button>
		</div>

	`,
  	methods: {
    	onClick() {
    		var sku;
    		for (var i in this.selected_variation) {
        		if (this.selected_variation.hasOwnProperty(i)) {
            		sku = i;
        		}
    		}

    		sendData({"sku":sku,"product_url":"/product/2"});
    		this.element_disabled = true;
    		this.element_text = "Sepete eklendi";
    		/*
    		vue_cart.internal_data.added_item = {
    			"exists": true,
			    "field_product_image": "/sites/default/files/styles/cart_block_thumbnail_80x80/public/default_images/document.png?itok=FcgyOQGP",
    			"title": vue_atcf.product_name,
    			"price__number": vue_atcf.internal_data.selected_variation.price,
    			"total_price__number_1": vue_atcf.internal_data.selected_variation.price,
  			};
	    	vue_cart.internal_data.show_popup = true;
	    	vue_cart.incrementCount();
	    	*/
    	},
    },
});


// /////////////////////////////////////////////////////////////////////////////
// Main Vue instance
// ///////////////////////////////////////////////////////////////////////////// 
var vue_atcf = new Vue({
	el: '#atcf',
	data: {
		"selected_variation": "",
		"selected_quantity": "",
		"selected_options": {},
		"initial_quantities": atcf_data.external_data.product.quantities,
		"quantities": [],
		"prices": {},
    	"restriction_declarations": [],
    	"restrictions": [],
    	"structure": {},
		"external_data": atcf_data.external_data,
  	},
  	template: `
		<div class="add-to-cart-form" @change="onChange">
			<div class="atcf-singles clearfix">
				<atcf-single 
					v-for="element in external_data.product.single_valued_elements" 
					:key="element.label" 
					:element="element">
				</atcf-single>
			</div>
			<div class="atcf-texts clearfix">
				<atcf-text 
					v-for="element in external_data.product.text_inputs" 
					:key="element.label" 
					:element="element">
				</atcf-text>
			</div>
			<div class="atcf-selectors clearfix">
				<atcf-selector
					v-for="element in external_data.product.selectors"
					:key="element.label"
					:element="element"
					:disabled_opts="restrictions[element.level]">
				</atcf-selector>
			</div>
			<div class="atcf-radio-quantity clearfix">
				<atcf-radio-quantity
					:quantities="quantities"
					:prices="prices">
				</atcf-radio-quantity>
			</div>
			<div class="atcf-bottom clearfix">
				<atcf-price :selected_variation="selected_variation"></atcf-price>
				<atcf-add-to-cart-button :selected_variation="selected_variation"></atcf-add-to-cart-button>
			</div>
		</div>
	`,
  	created: function () {
  		this.quantities = this.initial_quantities;
  		organizeSelectors(this);

  		var t = this;
  		var selectors = t.external_data.product.selectors;
  		// Create an event listener to detect a change on a selector
  		EventBus.$on('element-changed', function(level){
  			var levelint = parseInt(level);
  			t.restrictions = rebuildRestrictions(t,selectors);
		});
  	},
  	  methods: {
    	onChange() {
    		t= this;
    		Vue.nextTick()
  			.then(function () {

	    		var name = "p" + t.external_data.product.product_uuid;
	    		//fixed code
				var sorted_options = [];
				for (var k in t.selected_options) {
				  if (t.selected_options.hasOwnProperty(k)) {
				    sorted_options.push(t.selected_options[k]);
				  }
				}
	    		sorted_options = sorted_options.sort(function(a, b){return a-b}); // sort as integers

				for(var i=0; i<sorted_options.length; i++){
					if(sorted_options[i] != null){
						name += "-" + sorted_options[i];
					}
				}
				selected_sku = name+"-"+t.selected_quantity;
				t.selected_variation = {};
				t.selected_variation[selected_sku] = t.external_data.variations[selected_sku];
				for(var i=0; i<t.quantities.length; i++){
					if(t.external_data.variations[name+"-"+t.quantities[i]]){
						Vue.set(t.prices, [t.quantities[i]], t.external_data.variations[name+"-"+t.quantities[i]].price);
					} else{
						Vue.set(t.prices, [t.quantities[i]], 99999);
					}
				}
			  })
    	},
    },
    mounted: function () {
  		this.onChange()
  	},
})

/*
TODO:
XXX. Adet restriction
XXX. Gecerli secenek yoksa selectoru gizle
XXX. Degisen elemani renklendir
XXX. Gecerli secenek olmayan selectorun limitlerini kaldir, selectionunu kaldir
*/