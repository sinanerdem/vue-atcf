Vue.component('atcf-select', {
	template: `
	<div class="atcf-select">
		<label>Label</label>
		<select id="" class="bdb-form-select" required="required">
			<atcf-select-option>XXX</atcf-select-option>
			<atcf-select-option>YYY</atcf-select-option>
			<atcf-select-option>ZZZ</atcf-select-option>
		</select>
	</div>
	`
});
Vue.component('atcf-select-option', {
	template: '<option value="220" selected="true"><slot></slot></option>'
});


Vue.component('atcf-radio', {
	template: `
	<div class="atcf-radio">
		<label>Label</label>
		<form action="">
	  		<atcf-radio-option>AAA</atcf-radio-option>
	  		<atcf-radio-option>BBB</atcf-radio-option>
	  		<atcf-radio-option>CCC</atcf-radio-option>
		</form>
	</div>
	`
});
Vue.component('atcf-radio-option', {
	template: '<label><input type="radio" name="gender" checked="true" value="female"> <slot></slot></label>'
});


Vue.component('atcf-imageradio', {
	template: `
	<div class="atcf-imageradio">
		<label>Label</label>
		<form action="">
	  		<atcf-imageradio-option><img src="https://www.bidolubaski.com/sites/all/themes/bdbtheme/logo.png"></atcf-imageradio-option>
	  		<atcf-imageradio-option><img src="https://www.bidolubaski.com/sites/all/themes/bdbtheme/logo.png"></atcf-imageradio-option>
	  		<atcf-imageradio-option>CCC</atcf-imageradio-option>
		</form>
	</div>
	`
});
Vue.component('atcf-imageradio-option', {
	template: '<label><input type="radio" name="gender" checked="true" value="female"> <slot></slot></label>'
});


Vue.component('atcf-price', {
	template: '<div>12345</div>'
});
Vue.component('atcf-pricedetails', {
	template: '<div>12345</div>'
});
Vue.component('atcf-timeline', {
	template: '<div>12345</div>'
});

new Vue({
	el: '#root'
});