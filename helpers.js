
function createdChildHelper(obj){
	obj.element_selected = obj.opts[0].value;
	obj.element_index = 0;
	obj.$root.internal_data.restriction_declarations[obj.level] = obj.opts[0].limitOthers;
	obj.$root.internal_data.selected_options[obj.level] = obj.element_selected;
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
	obj.$root.internal_data.restriction_declarations[obj.level] = opt.limitOthers;
	obj.element_index = index;
	obj.element_selected = opt.value;
	obj.$root.internal_data.selected_options[obj.level] = obj.element_selected;
	obj.$parent.onChildChange();
};