import imagecache
import watchimages
import signal
import ConfigParser
import sys
from ast import literal_eval

config = ConfigParser.RawConfigParser()
config.read("/etc/imagecache.conf")
image_path = config.get("General", "image_path")

stores = imagecache.CompositeStore()

for name, value in config.items("Caches"):
    sizes = literal_eval("(" + value + ")")
    stores.add(imagecache.ResizedStore(image_path, name, sizes))

watchimages.watchimages(image_path, stores)
