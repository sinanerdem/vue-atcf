function createdChildHelper(obj){
	obj.element_selected = obj.opts[0].value;
	obj.element_index = 0;
	obj.$root.internal_data.restriction_declarations[obj.level] = obj.opts[0].limitOthers;
	obj.$root.internal_data.selected_options[obj.level] = obj.element_selected;
};
function reorganizeChildHelper(obj){
	if(obj.opts[obj.element_index].disabled){
		obj.child_class = "fade-it";
		setTimeout(function() { obj.child_class = "" }, 1000);
		var no_options = true;
		for (var i = 0; i<obj.opts.length; i++){
			if (!obj.opts[i].disabled){
				obj.onClick(obj.opts[i],i);
				no_options = false;
				break;
			}
			if (no_options){
				obj.element_class = "option-not-available";
			}
		}
	} else{
		obj.element_class = "";
	}
};
function computePricesforCountHelper(obj){
	var variationsBeforeCount = [];
	for (i in obj.opts){
	    var varia = obj.$root.external_data.variations[obj.$root.internal_data.nameBeforeCount + "-" + obj.opts[i].value];
		if (varia){
			variationsBeforeCount.push(varia.price);
		}
	}	
	return variationsBeforeCount;
}
function selectionChildHelper(opt,index,obj){
	obj.$root.internal_data.restriction_declarations[obj.level] = opt.limitOthers;
	obj.element_index = index;
	obj.element_selected = opt.value;
	obj.$root.internal_data.selected_options[obj.level] = obj.element_selected;
	obj.$parent.onChildChange();
};

Vue.component('atcf', {
	props:[
		'external_data',
		'internal_data',
	],
	computed: {
    	elements: function () {
      		return this.external_data.elements;
    	},
    	selected_variation: function () {
      		return this.internal_data.selected_variation;
    	},
    	selected_options: function () {
      		return this.internal_data.selected_options;
    	},
    	restriction_declarations: function () {
      		return this.internal_data.restriction_declarations;
    	},
  	},
	template: `
		<div class="add-to-cart-form">
			<div class="single-valued clearfix">
				<atcf-single v-for="element in elementSingleorMultiple('singles')" :key="element.id" :element="element"></atcf-single>
			</div>
			<component v-for="element in elementSingleorMultiple('multis')" :key="element.id" :is=element.selector ref="children" :label=element.label :level=element.level :opts=element.opts></component>
			<div class="atcf-bottom clearfix">
				<atcf-price :selected_variation="selected_variation"></atcf-price>
				<atcf-add-to-cart-button></atcf-add-to-cart-button>
			</div>
		</div>
		`,
	methods: {
    	onChildChange() {
       		vue_atcf.recalculate();
    		// reorganize each component after some change happens
    		for (var i = 0; i<this.$refs.children.length; i++){
    			this.$refs.children[i].reorganizeChild();
    		}
    		vue_atcf.renameSelected();
    	},
    	elementSingleorMultiple(type){
    		var multis_array = [];
    		var singles_array = [];
    		for (i in this.elements){
    			if(this.elements[i]["opts"].length == 1){
    				singles_array.push(this.elements[i]);
    			} else{
    				multis_array.push(this.elements[i]);
    			}
    		}
    		if (type == "singles"){
    			return singles_array;
    		}	else if (type == "multis"){
    			return multis_array;
    		}	else{
    			throw new Error('Invalid parameter for elementSingleorMultiple function!');
    		}
    	}
    },
});

Vue.component('atcf-select', {
	props: [
		'label',
	 	'level',
	 	'opts',
	 	'value',
	 	'index',
	],
	data() {
		return {
			element_selected: '',
			element_index: '',
			element_class: '',
			child_class: ''
		};
	},
	template: `
		<div id="" class="atcf-element atcf-select" :class="element_class">
			<label class="element-label">{{label}}</label>
			<div  class="select element-inner" :class="child_class">
				<select @change="onChange">
					<option v-for="(opt,index) in opts" :selected="(element_index==index) ? true : false" :key="index" :value="opt.value" :disabled="opt.disabled">
		   				{{ opt.text }}
		  			</option>
				</select>
			</div>
			<div class="show-if-no-options">Yukarıdaki seçimlerle bu özellik sunulmaz</div>
		</div>
	`,
	methods: {
		onChange(e) {
      		let index = e.target.selectedIndex;
      		let opt = this.opts[index];
      		selectionChildHelper(opt,index,this);
    	},
    	onClick(opt,index) {
    		selectionChildHelper(opt,index,this);
    	},
    	reorganizeChild(){
    		reorganizeChildHelper(this);
    	}
    },
	created: function () {
		createdChildHelper(this);
  	},
});
Vue.component('atcf-radio', {
	props: [
		'label',
	 	'level',
	 	'opts',
	 	'name',
	],
	data() {
		return {
			element_selected: '',
			element_index: '',
			element_class: '',
			child_class: '' 
		};
	},
	template: `
		<div id="" class="atcf-element atcf-radio" :class="element_class">
			<label class="element-label">{{label}}</label>
			<form action="" class ="element-inner" :class="child_class">
				<label v-for="(opt,index) in opts"><input type="radio" @click="onClick(opt,index)" :name="level" :disabled="opt.disabled" :value="opt.value" v-model="element_selected">{{ opt.text }}</label>
			</form>
			<div class="show-if-no-options">Yukarıdaki seçimlerle bu özellik sunulmaz</div>
		</div>
	`,
	methods: {
    	onClick(opt,index) {
    		selectionChildHelper(opt,index,this);
    	},
    	reorganizeChild(){
    		reorganizeChildHelper(this);
    	}
    },
	created: function () {
    	createdChildHelper(this);
  	},

});
Vue.component('atcf-radio-price', {
	props: [
		'label',
	 	'level',
	 	'opts',
	 	'name',
	],
	data() {
		return {
			element_selected: '',
			element_index: '',
			element_class: '',
			child_class: '',
			unit_price: [],
		};
	},
	template: `
		<div id="" class="atcf-element atcf-radio-price" :class="element_class">
			<label class="element-label">{{label}}</label>
			<form action="" class ="element-inner" :class="child_class">
				<label v-for="(opt,index) in opts"><input type="radio" @click="onClick(opt,index)" :name="level" :disabled="opt.disabled" :value="opt.value" v-model="element_selected">{{ opt.text }} <br /> {{unit_price[index]}} TRY</label>
			</form>
			<div class="show-if-no-options">Yukarıdaki seçimlerle bu özellik sunulmaz</div>
		</div>
	`,

	methods: {
    	onClick(opt,index) {
    		selectionChildHelper(opt,index,this);
    	},
    	reorganizeChild(){
    		reorganizeChildHelper(this);
    		this.unit_price = computePricesforCountHelper(this);
    	}
    },
	created: function () {
    	createdChildHelper(this);
  	},
  	mounted: function () {
    	this.unit_price = computePricesforCountHelper(this);
  	},

});
Vue.component('atcf-single', {
	props: [
		'element',
	],
	template: `
	<div class="atcf-single">
		<label class="element-label">{{element["label"]}}</label> <span class="text">{{element["opts"][0]["text"]}}</span>
	</div>
	`,
});
Vue.component('atcf-price', {
	props: [
		'selected_variation',
	],
	template: `
	<div class="atcf-price">
		<div>Fiyat: {{selected_variation.price}} +KDV</div>
		<div>{{selected_variation.discount}} indirimli fiyat: {{this.discountedPrice}}</div>
		<div>Toplam fiyat: {{selected_variation.total_price}} KDV dahil</div>
	</div>
	`,
	computed: {
    	discountedPrice: function () {
      		return this.selected_variation.price - (this.selected_variation.price * this.selected_variation.discount_percentage / 100);
    	},
  	},
});
Vue.component('atcf-add-to-cart-button', {
	data() {
		return {
			element_disabled: false,
			element_text: "Sepete ekle"
		};
	},
	template: `
		<div class="add-to-cart-button">
			<button class="button is-primary" :disabled="this.element_disabled ? true : null" @click="onClick()">{{element_text}}</button>
		</div>

	`,
  	methods: {
    	onClick() {
    		this.element_disabled = true;
    		this.element_text = "Sepete eklendi";
    		vue_cart.internal_data.added_item = {
    			"exists": true,
			    "field_product_image": "/sites/default/files/styles/cart_block_thumbnail_80x80/public/default_images/document.png?itok=FcgyOQGP",
    			"title": vue_atcf.product_name,
    			"price__number": vue_atcf.internal_data.selected_variation.price,
    			"total_price__number_1": vue_atcf.internal_data.selected_variation.price,
  			};
	    	vue_cart.internal_data.show_popup = true;
	    	vue_cart.incrementCount();
    		alert(vue_atcf.internal_data.selected_variation.name + " ürününü sepete eklediniz.");
    	},
    },
});
var vue_atcf = new Vue({
	el: '#atcf',
	data: {
		"product_uuid": "1",
		"product_name": "El Ilani",
		"internal_data": {
			"selected_variation": {},
			"selected_options": [],
    		"restriction_declarations": [],
    		"nameBeforeCount": "",
		},
		"external_data": atcf_data.external_data,
  	},
  	computed: {
    	storeRestDecl: function () {
      		return this.internal_data.restriction_declarations;
    	},
    	storeSelOpt: function(){
    		return this.internal_data.selected_options;
    	},
  	},
  	methods:{
  		clearAll(){
  			for (var i = 0, len = this.external_data.elements.length; i < len; i++) {
  				for (var k=0, len2 = this.external_data.elements[i].opts.length; k < len2; k++){
  					this.external_data.elements[i].opts[k]["text"] += " ";
  					this.external_data.elements[i].opts[k]['disabled'] = false;
  				}
  			}
  		},
  		recalculate() {
  			// first clear all disabled
  			this.clearAll();
  			// second set disabled
  			for (var i = 0; i<this.storeRestDecl.length; i++){
  			  for (var j in this.storeRestDecl[i]){
  			    intj = parseInt(j);
  			    for (var k = 0; k<this.storeRestDecl[i][j].length; k++){
  			      for( var x = 0; x < this.external_data.elements[intj].opts.length; x++){
  			        if (this.external_data.elements[intj].opts[x]["value"] === this.storeRestDecl[i][j][k]){
  			          this.external_data.elements[intj].opts[x]["disabled"] = true;
  			          this.external_data.elements[intj].opts[x]["text"] += " ";

  			        }
  			      }
  			    }
  			  }
  			}
  		},
  		renameSelected(){
  			// construct variation name
  			var variationName = "p" + this.product_uuid;
  			var nameBeforeCount = ""
  			for (var i=0; i < this.storeSelOpt.length; i++){
  				if (i == this.storeSelOpt.length - 1){
  					nameBeforeCount = variationName;
  				}
  				variationName += "-" + this.storeSelOpt[i];
  			}
  			// Check if this variation really exists in external data
  			if (this.external_data.variations[variationName]){
  				this.internal_data.nameBeforeCount = nameBeforeCount;
	  			this.internal_data.selected_variation = this.external_data.variations[variationName];
	  			this.internal_data.selected_variation.name = variationName;
  			} else{
  				this.internal_data.selected_variation = this.external_data.variations['EL_ILANI'];
  				this.internal_data.selected_variation.name = 'EL ILANI';
  				//alert("Yanlış işlem tespit edildi. Site yöneticilerine bildiriniz. HATA KODU: BDB-NOVAR");
  			}
  		},
  	},
  	created: function () {
  		// Set all options disabled to false at first.
  		this.clearAll();
  	},
})
vue_atcf.recalculate();
vue_atcf.renameSelected();