
function nice_hex(n, show_leading_0){
	if (isNaN(n))
		return n;
	var s = n.toString(16);
	while (s.length < 4)
		s = '0' + s;
	if (show_leading_0)
		s = '0x' + s;
	return s;
}
