var express = require('express');
var fs = require('fs');
var path = require('path');
var sizeOf = require('image-size');
var ini = require('ini');

var config = ini.parse(fs.readFileSync('/etc/imagecache.conf', 'utf-8'));
var image_path = config['General']['image_path'];

var router = express.Router();

router.use('/images', express.static(image_path));

router.get('/folders.json', function(req, res) {
    var subdir = req.query.path;
    res.setHeader('Content-Type', 'application/json');
    if (typeof subdir == 'undefined') {
        res.send(JSON.stringify([]));
    }
    var dir = path.join(image_path, subdir);
    if (!fs.existsSync(dir)) {
        res.send(JSON.stringify([]));
    }
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
        res.send(JSON.stringify(dirs, null, 3));
    });
});

router.get('/photos.json', function(req, res) {
    var subdir = req.query.path;
    res.setHeader('Content-Type', 'application/json');
    if (typeof subdir == 'undefined') {
        res.send(JSON.stringify([]));
    }
    var dir = path.join(image_path, subdir);
    if (!fs.existsSync(dir)) {
        res.send(JSON.stringify([]));
    }
    fs.readdir(dir, function(err, files) {
		var images = []
        if (typeof files == 'undefined') return;

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
                        path: path.join('/.thumbnails', subdir, file),
						width: thumb_size.width,
						height: thumb_size.height
					},
					preview: {
                        path: path.join('/.preview', subdir, file),
						width: preview_size.width,
						height: preview_size.height
					}
				});
		    }
		}
		res.send(JSON.stringify(images, null, 3));
	});
});

module.exports = router;
if (require.main === module) {
    var app = express();
	app.use('/', router);
	app.listen(9123);
}
