<template>
    <div class="container-fluid">
        <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightgallery/1.3.7/css/lightgallery.min.css" />
        <h2>{{ path }}</h2>
        
        <div class="row">
          <div class="grid" id="thumbnails">
             <div class="grid-item thumbnail" v-for="image in images" 
                        v-bind:style="{ width: image.thumbnail.width, height: image.thumbnail.height }">
                 <a v-bind:href="image_path + image.preview.path"
                   v-bind:data-download-url="image_path + image.full.path">
                 
                     <img v-bind:src="image_path + image.thumbnail.path"
                     v-bind:width="image.thumbnail.width"
                     v-bind:height="image.thumbnail.height"
                     />
                 </a>
              </div>
          </div>
          
        </div>
    </div>
</template>

<script>
import Masonry from 'masonry-layout';
import 'lightgallery.js';
import 'lg-autoplay.js';
import 'lg-fullscreen.js';
import 'lg-share.js';
import 'lg-zoom.js';

export default {
  name: 'Thumbnails',
  props: {
      path: String
  },
  data: function() {
      var image_path = this.$http.options.root + '/files';

      return {
          images: [],
          masonry: null,
          gallery: null,
          image_path: image_path
      }
  },
  methods: {
      loadImages: function() {
          this.$http.get('api/photos.json?path=' + this.path).then((response) => {
            this.images = response.body;
            this.masonry.layout();
            
          }, (response) => {
            // error callback
          });
      }
  },
  mounted: function() {
     this.loadImages();
     this.masonry = new Masonry( this.$el.querySelector('#thumbnails'), {
         itemSelector: '.grid-item',
         columnWidth: 200
     });
     this.gallery = lightGallery(this.$el.querySelector('#thumbnails'));
  },
  watch: {
      path: function(val) {
          this.loadImages();
      },
      '$route' (to, from) {
          console.log('change', to, from);
      }
   },
   updated: function(val) {
        var el = document.querySelector('#thumbnails');
        window.lgData[el.getAttribute('lg-uid')].destroy(true);
        this.gallery = lightGallery(el, {
            selector: '.grid-item a',
            progressBar: false,
            hideBarsDelay: 3000
        });
   }
}
</script>

<style>
.grid-item {
    float: left;
    margin:5px;
    
}
</style>
