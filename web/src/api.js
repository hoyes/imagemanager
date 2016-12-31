var express = require('express');
var fs = require('fs');
var path = require('path');
var sizeOf = require('image-size');

var router = express.Router();
var image_path = "/home/peter/src/imagemanager/images"

router.use('/images', express.static(image_path));

router.get('/folders.json', function(req, res) {
	var subdir = req.query.path;
	var dir = path.join(image_path, subdir);
    fs.readdir(dir, function(err, files) {
		var dirs = [];
		for (var file of files) {
			var fullpath = path.join(dir, file)
		    if (file[0] != '.' && fs.statSync(fullpath).isDirectory()) {
                dirs.push({
						name: file,
						path: path.join(subdir, file)
				});
			}
		}
		res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(dirs, null, 3));
	});
});

router.get('/images.json', function(req, res) {
	var subdir = req.query.path;
	var dir = path.join(image_path, subdir);
    fs.readdir(dir, function(err, files) {
		var images = []

        for (var file of files) {
		    var ext = path.extname(file).toLowerCase();
            if (ext == '.jpg' || ext == '.jpeg') {
				var thumb_path = path.join(image_path, '.thumbnails', subdir, file);
				var preview_path = path.join(image_path, '.preview', subdir, file);
                var thumb_size = sizeOf(thumb_path);
                var preview_size = sizeOf(preview_path);

				images.push({
					full: {
				        path: path.join(req.query.path, file)
					},
					thumbnail: {
                        path: path.join('.thumbnails', subdir, file),
						width: thumb_size.width,
						height: thumb_size.height
					},
					preview: {
                        path: path.join('.preview', subdir, file),
						width: preview_size.width,
						height: preview_size.height
					}
				});
		    }
		}
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(images, null, 3));
	});
});

module.exports = router;
if (require.main === module) {
    var app = express();
	app.use('/api', router);
	app.listen(8080);
}
