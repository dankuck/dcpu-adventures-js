/* prerequisites: 
 * create_dom_tree.js
 * timeouts.js
 * memory_watcher.js
 * register_watcher.js
 */

(function(root){

	var running_led = 'data:image/gif;base64,R0lGODlhEQARAPIAMf///3P/czn/OQD/AADnAADGAAAAAAAAACH5BAEAAAAALAAAAAARABEAQANNCLrcayPKIQSNxmltSiHTlD1SVQVoMDJG53lt00noZA0jZJsnLkMp1YrTim1cLwLIx/oMaqHVLBSpYBQ6qinABGQpPNTQSwmmxqwiOgEAOw==';
	var not_running_led = 'data:image/gif;base64,R0lGODlhEQARAPMAMf////9ze/9ra/9SUv9CQv85Of8YIf8ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAARABEAQARYEMhJ60Qn60MM+QJijSNSbOghXp4wDIEgxMFKIdhxqraUZ4EAqkBYmQgc4ucFC1VwMVmtZ8FZSQAMMkX9BbmXlIZALBg3SKKB6fQpPwR2+xKQw2pYK84SAQA7';

	var adventure_html = 
			'<div>'
			+ '	<div id="hud_area" style="float: right; width: 49%; margin: 0 auto">'
			+ '		<div id="hud" style="width: 100%; height: 20em; border: 1px solid black;"></div>'
			+ '	</div>'
			+ '	<div id="textarea_area">'
			+ '		<textarea id="js_code" style="width: 50%; height: 24em;"></textarea>'
			+ '		<div id="buttons">'
			+ '			<img id="led" />'
			+ '			<button onclick="return false;" id="run_button">RUN</button>'
			+ '			<button onclick="return false;" id="stop_button">STOP</button>'
			+ '		</div>'
			+ '	</div>'
			+ '	<div style="clear: both"></div>'
			+ '</div>';

	var dcpu_html =
			'<div>'
			+ '	<div style="float: right; width: 49%">'
			+ '	<div style="display: table-cell;">'
			+ '		<br />'
			+ '		<div id="registers"></div>'
			+ '	</div>'
			+ '	<div style="display: table-cell;">'
			+ '		<div id="memory" style="font-family: courier;"></div>'
			+ '	</div>'
			+ '	</div>'
			+ ''
			+ '	<textarea id="dcpu_code" style="width: 50%; height: 20em;"></textarea>'
			+ '	<div id="buttons">'
			+ '		<img id="led" />'
			+ '		<button onclick="return false;" id="run_dcpu_button">RUN</button>'
			+ '		<button onclick="return false;" id="stop_dcpu_button">STOP</button>'
			+ '		<button onclick="return false;" id="continue_dcpu_button">CONTINUE</button>'
			+ '		<button onclick="return false;" id="compile_dcpu_button">COMPILE</button>'
			+ '		<button onclick="return false;" id="reset_dcpu_button">RESET</button>'
			+ '	</div>'
			+ '	<div style="clear: both"></div>'
			+ '</div>';

	var createAdventure = function(name, dcpu, default_code, hide_code, auto_run){
		var tree = Adventure.createDOMTree(adventure_html);
		var hud = tree.getElementById('hud');
		var js_code = tree.getElementById('js_code');
		var led = tree.getElementById('led');
		js_code.name = name;
		if (default_code)
			js_code.value = default_code;
		if (hide_code){
			js_code.style.display = 'none';
			var hud_area = tree.getElementById('hud_area');
			hud_area.style.cssFloat = '';
			tree.style.width = '100%';
			hud_area.appendChild(tree.getElementById('buttons'));
		}
		var run_button = tree.getElementById('run_button');
		var stop_button = tree.getElementById('stop_button');
		var setInterval = createSetInterval();
		var clearInterval = setInterval.clearInterval;
		var setTimeout = createSetTimeout();
		var clearTimeout = setTimeout.clearTimeout;
		var run = function(){
			stop();
			hud.innerHTML = '';
			eval(js_code.value);
			led.src = running_led;
		};
		var stop = function(){
			setTimeout.stop();
			setInterval.stop();
			dcpu.removeDevices();
			dcpu.removeOns();
			led.src = not_running_led;
		};
		run_button .addEventListener('click', run);
		stop_button.addEventListener('click', stop);
		led.src = not_running_led;
		if (auto_run)
			setTimeout(run, 10);
		return tree;
	};
	
	var createSolution = function(name, dcpu, default_code){
		var tree = Adventure.createDOMTree(dcpu_html);
		var memory = tree.getElementById('memory');
		var run_dcpu_button = tree.getElementById('run_dcpu_button');
		var stop_dcpu_button = tree.getElementById('stop_dcpu_button');
		var continue_dcpu_button = tree.getElementById('continue_dcpu_button');
		var compile_dcpu_button = tree.getElementById('compile_dcpu_button');
		var reset_dcpu_button = tree.getElementById('reset_dcpu_button');
		var registers = tree.getElementById('registers');
		var led = tree.getElementById('led');
		var dcpu_code = tree.getElementById('dcpu_code')
		dcpu_code.name = name;
		if (default_code)
			dcpu_code.value = default_code;
		var stopping = false;
		var stop = function(cb){
			if (stopping)
				return false;
			if (dcpu.running){
				dcpu.stop();
				stopping = true;
				var tries = 5;
				var watcher = setInterval(function(){
					if (! dcpu.running){
						cb && cb();
						return [clearInterval(watcher), stopping = false];
					}
					if (--tries == 0)
						return [clearInterval(watcher), stopping = false];
				}, 100);
			}
			else
				cb && cb();
		};
		var compile = function(code){
			if (/^[0-9A-Fx\s]+$/i.test(code)){
				var hexes = code.replace(/^\s+|\s+$/, '').split(/\s+/);
				for (var i = 0; i < hexes.length; i++)
					dcpu.set(i, parseInt(/^0x/.test(hexes[i]) ? hexes[i] : '0x' + hexes[i]));
			}
			else
				new DCPU16.Assembler(dcpu).compile(code);
		};
		run_dcpu_button
			.addEventListener('click', function(){
				stop(function(){
					dcpu.set('pc', 0);
					compile(tree.getElementById('dcpu_code').value);
					dcpu.run();
				});
			});
		stop_dcpu_button
			.addEventListener('click', function(){
				stop();
			});
		compile_dcpu_button
			.addEventListener('click', function(){
				compile(tree.getElementById('dcpu_code').value);
			});
		continue_dcpu_button
			.addEventListener('click', function(){
				dcpu.run();
			});
		reset_dcpu_button
			.addEventListener('click', function(){
				stop(function(){
					dcpu.mem.length = 0; // rm all
					dcpu.mem.length = dcpu.ramSize; // put back 0's
					for (var i = 0; i < dcpu.ramSize; i++)
						dcpu.mem[i] = 0;
					var regs = ['a', 'b', 'c', 'x', 'y', 'z', 'i', 'j', 'pc', 'sp', 'ia', 'ex'];
					for (var i = 0; i < regs.length; i++)
						dcpu.mem[regs[i]] = 0;
				});
			});
		registers.appendChild(Adventure.makeRegisterWatcher(dcpu));
		var memory_watcher = Adventure.makeMemoryWatcher(dcpu);
		memory.innerHTML = '';
		memory.appendChild(memory_watcher);
		setInterval(function(){
			if (dcpu.running)
				led.src = running_led;
			else
				led.src = not_running_led;
		}, 100);
		return tree;
	};
	
	if (! root.Adventure)
    	root.Adventure = {};
    root.Adventure.createAdventure = createAdventure;
    root.Adventure.createSolution = createSolution;

})(this);
