import os.path
from PIL import Image

class BaseStore:
    def create(self, path):
        raise NotImplementedException()
    def move(self, path):
        raise NotImplementedException()
    def delete(self, path):
        raise NotImplementedException()
    def synchronize(self):
        raise NotImplementedException()

class ResizedStore(BaseStore):
    def __init__(self, image_path, subdir, image_size):
        self.image_path = image_path
        self.subdir = "." + subdir
        self.image_size = image_size

    def __get_resized_path(self, path):
        path_stem = path[len(self.image_path)+1:]
        return os.path.join(self.image_path, self.subdir, path_stem)
    
    def __get_base_path(self, path):
        path_stem = path[len(self.image_path)+len(self.subdir)+2:]
        return os.path.join(self.image_path, path_stem)
    

    def create(self, path):
        thumb_path = self.__get_resized_path(path) 
        if not os.path.exists(thumb_path) or os.path.getmtime(thumb_path) < os.path.getmtime(path):
            thumb_dir = os.path.dirname(thumb_path)
            if not os.path.exists(thumb_dir):
                os.makedirs(thumb_dir)

            try:
                image = Image.open(path)
                image.thumbnail(self.image_size, Image.ANTIALIAS)
                image.save(thumb_path, "JPEG", progressive=True)
                print("Created: %s" % (path))
            except IOError:
                print("Not an image file: %s" % (path))

    def delete(self, path):
        thumb_path = self.__get_resized_path(path) 
        if os.path.exists(thumb_path):
            os.unlink(thumb_path)

    def move(self, from_path, to_path):
        from_thumb_path = self.__get_resized_path(from_path)
        to_thumb_path = self.__get_resized_path(to_path)
        if os.path.exists(from_thumb_path):
            thumb_dir = os.path.dirname(to_thumb_path)
            if not os.path.exists(thumb_dir):
                os.makedirs(thumb_dir)
            
            os.rename(from_thumb_path, to_thumb_path)
        else:
            self.create(to_path)

    def synchronize(self):
        #Ensure resized image exists for every base image
        for root, dirs, files in os.walk(self.image_path):
            if "/." not in root:
                for name in files:
                    if name.lower().endswith((".jpg", ".png", ".jpeg")):
                        self.create(os.path.join(root, name))
        
        #Prune resized folder
        for root, dirs, files in os.walk(self.__get_resized_path(self.image_path), topdown=False):
            for name in files:
                resized_path = os.path.join(root, name)
                base_path = self.__get_base_path(resized_path)
                if not os.path.exists(base_path):
                    print("Deleting %s, %s" %(resized_path, base_path))
                    os.unlink(resized_path)

            for name in dirs:
                resized_path = os.path.join(root, name)
                base_path = self.__get_base_path(resized_path)
                if not os.path.exists(base_path):
                    print("Deleting %s" %(resized_path))
                    os.rmdir(resized_path)

class CompositeStore(BaseStore):
    def __init__(self):
        self.stores = []
    def add(self, store):
        self.stores.append(store)
    def create(self, path):
        for store in self.stores:
            store.create(path)
    def move(self, from_path, to_path):
        for store in self.stores:
            store.move(from_path, to_path)
    def delete(self, path):
        for store in self.stores:
            store.delete(path)
    def synchronize(self):
        for store in self.stores:
            store.synchronize()
