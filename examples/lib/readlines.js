// Modified from: 
// http://stackoverflow.com/a/6833016

function getnextLineOffset(string, startAt) {
	var startAt = startAt || 0;
	var index = string.indexOf('\r', startAt);
	var newlineSize;

	if(index >= 0) {
		if(string.charAt(index + 1) === "\n")
			newlineSize = 2;
		else
			newlineSize = 1;
	} else {
		index = string.indexOf('\n', startAt);
		newlineSize = 1;
	}

	return {
		last : startAt,
		index : index,
		next : index + newlineSize,
	};
}

function readLines(input, func, done) {
	var remaining = '';
	var lineNumber = 0;

	input.on('data', function(data) {
		remaining += data;
		var lineInfo = getnextLineOffset(remaining);

		while (lineInfo.index > -1) {
			var line = remaining.substring(lineInfo.last, lineInfo.index);
			func(line, ++lineNumber);
			lineInfo = getnextLineOffset(remaining, lineInfo.next);
		}

		remaining = remaining.substring(lineInfo.last);
	});

	input.on('end', function() {
		if (remaining.length > 0) {
			func(remaining);
		}
		done();
	});
}

module.exports = readLines;