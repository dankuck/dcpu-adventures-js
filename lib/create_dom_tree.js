(function(root){

	var createDOMTree = function(html){
		var span = document.createElement('span');
		span.innerHTML = html;
		if (span.childNodes.length == 1)
			span = span.firstChild;
		span.getElementById = function(id){
			var nodes = span.getElementsByTagName('*');
			for (var i = 0; i < nodes.length; i++)
				if (nodes[i].id == id)
					return nodes[i];
			return null;
		};
		return span;
	};
	
	if (typeof module === 'undefined') {
	    (root.Adventure = (root.Adventure || {})).createDOMTree = createDOMTree;
	} else {
	    module.exports = createDOMTree;
	}

})(this);
