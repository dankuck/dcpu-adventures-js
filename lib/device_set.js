(function(root){
	
	function DeviceSet(dcpu){
		this.dcpu = dcpu;
		this.devices = {};
	};
	DeviceSet.prototype = {
		getAll: function(){
			var devs = {};
			for (var name in this.devices)
				devs[name] = this.devices[name];
			return devs;
		},
		get: function(name){
			return this.devices[name];
		},
		add: function(name, device, replace){
			if (this.devices[name] && replace)
				this.remove(name);
			if (! this.devices[name]){
				this.devices[name] = device;
				this.dcpu.addDevice(device);
			}
			return this.devices[name];
		},
		remove: function(name){
			var device = this.devices[name];
			if (device){
				delete this.devices[name];
				this.dcpu.removeDevice(device);
			}
		},
		removeAll: function(){
			for (var name in this.devices)
				this.remove(name);
		},
		resetAll: function(){
			for (var name in this.devices)
				if (typeof this.devices[name].reset === 'function')
					this.devices[name].reset();
		}
	};
	
	var makeDeviceSetController = function(dcpu, active, devices){
		if (! active)
			active = {};
		dcpu.devices = new DeviceSet(dcpu);
		var div = document.createElement('div');
		if (! devices)
			devices = {
						Keyboard: new Keyboard()
					};
		var create_label = function(name){
			var dev = div.appendChild(document.createElement('label'));
			dev.style.display = 'block';
			//dev.style.display = 'table-cell';
			//dev.style.cssFloat = 'left';
			dev.style.width = '49%';
			dev.style.height = '1.75em';
			dev.appendChild(document.createTextNode(' ' + name));
			return dev;
		};
		for (var name in devices)
		(function(name, device){
			var dev = create_label(name);
			dev.insertBefore(document.createTextNode(' '), dev.firstChild);
			var input = dev.insertBefore(document.createElement('input'), dev.firstChild);
			input.type = 'checkbox';
			input.name = 'devices[' + name + ']';
			input.value = 1;
			input.onchange = function(){
				if (this.checked)
					dcpu.devices.add(name, device);
				else
					dcpu.devices.remove(name);
			};
			if (active[name]){
				input.checked = true;
				input.onchange();
			}
		})(name, devices[name]);
		setInterval(function(){
			var device_set = dcpu.devices.getAll();
			for (var name in device_set)
				if (! devices[name]){
					create_label(name);
					devices[name] = device_set[name];
				}
		}, 100);
		return div;
	};

	if (typeof module === 'undefined') {
	    if (! root.Adventure)
	    	root.Adventure = {};
	    root.Adventure.makeDeviceSetController = makeDeviceSetController;
	    root.Adventure.DeviceSet = DeviceSet;
	} else {
	    module.exports = makeDeviceSetController;
	}

})(this);