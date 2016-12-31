import time
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

def watchimages(image_path, stores):

    class ImageEventHandler(PatternMatchingEventHandler):
        def __init__(self):
            PatternMatchingEventHandler.__init__(self,
                    ignore_patterns=["*/.thumbnails/*", "*/.preview/*"],
                    patterns=["*.jpg", "*.png", "*.jpeg"],
                    ignore_directories=True)
        def on_created(self, event):
            stores.create(event.src_path)
        def on_modified(self, event):
            stores.create(event.src_path)
        def on_moved(self, event):
            stores.move(event.src_path, event.dest_path)
        def on_deleted(self, event):
            stores.delete(event.src_path)

    image_handler = ImageEventHandler()
    observer = Observer()
    observer.schedule(image_handler, image_path, recursive=True)
    observer.start()

    try:
        while True:
            stores.synchronize()
            time.sleep(3600)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
