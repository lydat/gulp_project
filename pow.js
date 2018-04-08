var mkdirp = require('mkdirp');

var	common ='./app/common/',
	js     ='./app/js/',
	css    ='./app/css/',
	img    ='./app/img/',
	imgico ='./app/img/ico',
	dist   ='./dist/';
	
var dirs = [common,js,css,img,imgico,dist];

for (var i=0;i<dirs.length;i++) {
	mkdirp(dirs[i], function (err) {
	    if (err) console.error(err)
	    else console.log('pow!')
	});
}
