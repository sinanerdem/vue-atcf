
const store = {
  data: {
    selectedOptions: {},
    restrictionDeclarations: [],
  }
};
Vue.component('display-store', {
	props: [
		'storedata',
	],
	template: `
		<div>
			{{ storedata }}
		</div>
	`,
	created: function () {
    	this.storedata= store.data;
  	},
});


function createdChildHelper(obj){
	obj.element_selected = obj.opts[0].value;
	obj.element_index = 0;
	store.data.restrictionDeclarations[obj.level] = obj.opts[0].limitOthers;
	store.data.selectedOptions[obj.level] = obj.element_selected;
};
function reorganizeChildHelper(obj){
	if(obj.opts[obj.element_index].disabled){
		var no_options = true;
		for (var i = 0; i<obj.opts.length; i++){
			if (!obj.opts[i].disabled){
				obj.onClick(obj.opts[i],i);
				no_options = false;
				obj.element_class = "";
				break;
			}
			if (no_options){
				obj.element_class = "hidden";
			}
		}
	} else{
		obj.element_class = "";
	}
};
function selectionChildHelper(opt,index,obj){
	store.data.restrictionDeclarations[obj.level] = opt.limitOthers;
	obj.element_index = index;
	obj.element_selected = opt.value;
	store.data.selectedOptions[obj.level] = obj.element_selected;
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
  	},
	template: `
		<div class="add-to-cart-form">
			
			<component v-for="element in elements" :key="element.id" :is=element.selector ref="children" :label=element.label :level=element.level :opts=element.opts></component>
			<atcf-price :selected_variation="selected_variation"></atcf-price>
			<atcf-add-to-cart-button></atcf-add-to-cart-button>
		</div>
		`,
	methods: {
    	onChildChange() {
       		vm.recalculate();
    		// reorganize each component after some change happens
    		for (var i = 0; i<this.$refs.children.length; i++){
    			this.$refs.children[i].reorganizeChild();
    		}
    		vm.renameSelected();
    	}
    },
});

Vue.component('atcf-select', {
	props: [
		'label',
	 	'level',
	 	'opts',
	],
	data() {
		return {
			element_selected: '',
			element_index: '',
			element_class: '',
		};
	},
	template: `
		<div id="" class="atcf-select select" :class="element_class">
			<select>
				<option v-for="(opt,index) in opts" :selected="(element_index==index) ? true : false" :value="opt.value" @click="onClick(opt,index)" :disabled="opt.disabled">
	   				{{ opt.text }} {{index}} {{element_index}}
	  			</option>
			</select>
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
		};
	},
	template: `
		<div id="" class="atcf-radio" :class="element_class">
			<label>{{label}}</label>
			<form action="">
				<label v-for="(opt,index) in opts"><input type="radio" @click="onClick(opt,index)" :name="level" :disabled="opt.disabled" :value="opt.value" v-model="element_selected">{{ opt.text }}</label>
			</form>
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
Vue.component('atcf-price', {
	props: [
		'selected_variation',
	],
	template: `
	<div class="atcf-price">
		<div>{{selected_variation.price}} +KDV</div>
		<div>{{selected_variation.discount}} indirimli fiyat: {{this.discountedPrice}}</div>
		<div>{{selected_variation.total_price}} KDV dahil</div>
		<div>ISIM: {{selected_variation.name}}</div>
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
		};
	},
	template: `
		<div class="add-to-cart-button">
			<button class="button is-primary" :disabled="this.element_disabled ? true : null" @click="onClick()">Sepete Ekle</button>
		</div>

	`,
	created: function () {
  	},
  	methods: {
    	onClick() {
    		this.element_disabled = true;
    		alert(vm.internal_data.selected_variation.name + " ürününü sepete eklediniz.");
    	},
    },
});
var vm = new Vue({
	el: '#atcf',
	data: {
		"product_uuid": "1",
		"internal_data": {
			"selected_variation": {},
		},
		"external_data": {
			"variations": {
				"p1-1-11-21": {
					"price": "111",
					"discount": "partner",
					"discount_percentage": "10",
					"total_price": "101"
				},
				"p1-1-11-22": {
					"price": "112",
					"discount": "partner",
					"discount_percentage": "10",
					"total_price": "102"
				},
				"p1-1-11-23": {
					"price": "113",
					"discount": "partner",
					"discount_percentage": "10",
					"total_price": "103"
				},
				"ERROR": {
					"price": "0",
					"discount": "partner",
					"discount_percentage": "0",
					"total_price": "ERROR"
				},
			},
	    	"elements": [
	    		{
		    		"selector": "atcf-select", 
		    		"label": "title1", 
		    		"level": "0", 
		    		"opts": [
		      			{ "text": "_1", "value": "1" },
		      			{ "text": "_2", "value": "2", "limitOthers": { "1" : ["11"], "2" : ["23"] } },
		      			{ "text": "_3", "value": "3", "limitOthers": { "1" : ["11","12","13"] } }
		    		]
	    		},
	            {
		    		"selector": "atcf-radio", 
		    		"label": "title2", 
		    		"level": "1", 
		    		"opts": [
		      			{ "text": "_11", "value": "11" },
		      			{ "text": "_12", "value": "12", "limitOthers": { "2" : ["21","22"] } },
		      			{ "text": "_13", "value": "13" }
		    		]
	    		},
	    		{
		    		"selector": "atcf-radio", 
		    		"label": "title3", 
		    		"level": "2", 
		    		"opts": [
		      			{ "text": "_21", "value": "21" },
		      			{ "text": "_22", "value": "22" },
		      			{ "text": "_23", "value": "23" }
		    		]
	    		}
	    	]
	    },
  	},
  	computed: {
    	storeRestDecl: function () {
      		return store.data.restrictionDeclarations;
    	},
    	storeSelOpt: function(){
    		return store.data.selectedOptions;
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
  			for (var i in this.storeSelOpt){
  				variationName += "-" + this.storeSelOpt[i];
  			}
  			// Check if this variation really exists in external data
  			if (this.external_data.variations[variationName]){
	  			this.internal_data.selected_variation = this.external_data.variations[variationName];
	  			this.internal_data.selected_variation.name = variationName;
  			} else{
  				this.internal_data.selected_variation = this.external_data.variations['ERROR'];
  				this.internal_data.selected_variation.name = 'ERROR-NAME';
  				alert("Yanlış işlem tespit edildi. Site yöneticilerine bildiriniz. HATA KODU: BDB-NOVAR");
  			}
  		},
  	},
  	created: function () {
  		// Set all options disabled to false at first.
  		this.clearAll();
  	},
})
vm.recalculate();
vm.renameSelected();