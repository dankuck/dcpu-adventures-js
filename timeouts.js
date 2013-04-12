var createSetTimeout = function(){
	var st = function(){
		var interval = window.setTimeout.apply(window, arguments);
		st.timeouts.push(interval);
		return interval;
	};
	st.timeouts = [];
	st.stop = function(){
		for (var i = 0; i < this.timeouts.length; i++)
			clearTimeout(this.timeouts[i]);
		this.timeouts = [];
	};
	st.clearTimeout = function(){ // optionally set clearTimeout to this
		window.clearTimeout.apply(window, arguments);
		for (var i = 0; i < st.timeouts.length; i++)
			if (st.timeouts[i] == arguments[0]){
				delete st.timeouts[i];
			}
	};
	return st;
};


var createSetInterval = function(){
	var si = function(){
		var interval = window.setInterval.apply(window, arguments);
		si.intervals.push(interval);
		return interval;
	};
	si.intervals = [];
	si.stop = function(){
		for (var i = 0; i < this.intervals.length; i++)
			clearInterval(this.intervals[i]);
		this.intervals = [];
	};
	si.clearInterval = function(){ // optionally set clearInterval to this
		window.clearInterval.apply(window, arguments);
		for (var i = 0; i < si.intervals.length; i++)
			if (si.intervals[i] == arguments[0]){
				delete si.intervals[i];
			}
	};
	return si;
};
