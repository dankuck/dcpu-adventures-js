(function(root){

	var makeRegisterWatcher = function(dcpu){
		var regs = ['a', 'b', 'c', 'x', 'y', 'z', 'i', 'j', 'sp', 'pc', 'ex', 'ia'];
		var inputs = {};
		var table = document.createElement('table');
		var tr;
		for (var i = 0; i < regs.length; i++){
			(function(){
				var r = regs[i];
				if (i % 3 == 0)
					tr = table.appendChild(document.createElement('tr'));
				var label = r;
				if (label == 'sp')
					label = '<span style="border: 1px solid blue">' + label + '</span>';
				if (label == 'pc')
					label = '<span style="border: 1px solid red">' + label + '</span>';
				tr.appendChild(document.createElement('td')).innerHTML = label;
				var input = inputs[r] = tr.appendChild(document.createElement('td')).appendChild(document.createElement('input'));
				input.size = 5;
				input.addEventListener('keyup', function(){
					var n = parseInt(input.value);
					if (isNaN(n))
						return;
					dcpu.mem[r] = n & 0xFFFF;
				});
				input.addEventListener('focus', function(){ input.focused = true });
				input.addEventListener('blur', function(){ delete input.focused });
			})();
		}
		setInterval(function(){
			for (var r in inputs){
				if (! inputs[r].focused)
					inputs[r].value = nice_hex(dcpu.mem[r], true);
			}
		}, 100);
		return table;
	};

	if (typeof module === 'undefined') {
	    (root.Adventure = (root.Adventure || {})).makeRegisterWatcher = makeRegisterWatcher;
	} else {
	    module.exports = makeRegisterWatcher;
	}

})(this);