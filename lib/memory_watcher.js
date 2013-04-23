(function(root){

	var text_arrows = function(element, ondone){
		var incer = null;
		element.addEventListener('keydown', function(event){
			if (event.keyCode == 38 || event.keyCode == 40){
				var n = parseInt(element.value);
				if (isNaN(n))
					return;
				var pause = 0;
				var change = function(){
					if (pause > 0)
						return pause--;
					if (event.keyCode == 38)
						n++;
					if (event.keyCode == 40)
						n--;
					element.value = nice_hex(n & 0xFFFF, true);
				};
				change();
				pause = 3;
				if (incer)
					clearInterval(incer);
				incer = setInterval(change, 100);
				event.preventDefault && event.preventDefault();
				event.stopPropagation && event.stopPropagation();
				event.cancelBubble = true;
			}
		}, true);
		element.addEventListener('keyup', function(event){
			if (event.keyCode == 38 || event.keyCode == 40){
				if (incer){
					clearInterval(incer);
					incer = null;
					ondone();
				}
				event.preventDefault && event.preventDefault();
				event.stopPropagation && event.stopPropagation();
				event.cancelBubble = true;
			}
		}, true);
	};

	var makeMemoryWatcher = function(dcpu, change_mem_peeker){
		var mem_matrix = [];
		var mem_matrix_labels = [];
		var div = document.createElement('div');
		div.className = 'memory_watcher';
		var focus_address = 0;
		var mem_peeker = div.appendChild(document.createElement('input'));
		mem_peeker.value = '0x0000';
		mem_peeker.size = 5;
		div.appendChild(document.createTextNode(' '));
		var mem_poker = div.appendChild(document.createElement('input'));
		mem_poker.value = '0x0000';
		mem_poker.size = 5;
		var go_to = div.appendChild(document.createElement('button'));
		go_to.innerHTML = 'jmp';
		go_to.style.fontSize = '50%';
		go_to.onclick = function(){
			return false; // in case it gets embeded in a form, which it often will
		};
		var table = div.appendChild(document.createElement('table'));
		table.style.fontSize = '8pt';
		table.style.border = '1px solid black';
		var mem_peeker_changed = function(){
			var n = parseInt(mem_peeker.value);
			if (isNaN(n))
				return;
			focus_address = n & 0xFFFF;
		};
		mem_peeker.addEventListener('keyup', mem_peeker_changed, true);
		text_arrows(mem_peeker, mem_peeker_changed);
		go_to.addEventListener('click', function(){
			mem_peeker.value = mem_poker.value;
			mem_peeker_changed();
		});
		var change_mem_peeker = function(address){
			mem_peeker.value = nice_hex(address, true);
			mem_peeker_changed();
		};
		var mem_poker_changed = function(){
			var n = parseInt(mem_poker.value);
			if (isNaN(n))
				return;
			dcpu.mem[focus_address] = n & 0xFFFF;
		};
		mem_poker.addEventListener('keyup', mem_poker_changed);
		text_arrows(mem_poker, mem_poker_changed);
		mem_poker.addEventListener('focus', function(){ mem_poker.focused = true });
		mem_poker.addEventListener('blur', function(){ delete mem_poker.focused });
		for (var i = 0; i < 16; i++){
			mem_matrix_labels[i] = document.createElement('td');
			var tr = table.appendChild(document.createElement('tr'));
			tr.appendChild(mem_matrix_labels[i]);
			mem_matrix_labels[i].className = 'address_label';
			for (var j = 0; j < 8; j++){
				var a = mem_matrix[i * 8 + j] = document.createElement('a');
				a.href = '#';
				a.className = 'word';
				a.onclick = function(){
					change_mem_peeker(this.address);
					return false;
				};
				var td = tr.appendChild(document.createElement('td'));
				td.appendChild(mem_matrix[i * 8 + j]);
			}
		}
		setInterval(function(){
			if (! mem_poker.focused)
				mem_poker.value = nice_hex(dcpu.mem[focus_address], true);
			var start = parseInt(focus_address / 8) * 8 - 8 * 8;
			start &= 0xFFFF;
			for (var i = 0; i < 16; i++){
				mem_matrix_labels[i].innerHTML = nice_hex((start + i * 8) & 0xFFFF);
			}
			for (var i = 0; i < 8 * 16; i++){
				var address = (start + i) & 0xFFFF;
				var n = nice_hex(dcpu.mem[address]);
				if (address == focus_address)
					n = "<span class='focus_address'>" + n + "</span>";
				if (address == dcpu.mem.pc)
					n = "<span class='pc'>" + n + "</span>";
				if (address == dcpu.mem.sp)
					n = "<span class='sp'>" + n + "</span>";
				mem_matrix[i].address = address;
				if (mem_matrix[i].innerHTML != n)
					mem_matrix[i].innerHTML = n;
			}
		}, 100);
		return div;
	};

	if (typeof module === 'undefined') {
	    (root.Adventure = (root.Adventure || {})).makeMemoryWatcher = makeMemoryWatcher;
	} else {
	    module.exports = makeMemoryWatcher;
	}

})(this);