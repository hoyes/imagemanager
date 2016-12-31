<template>
  <div>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

    <b-navbar fixed="top" type="default" full>
<div class="container-fluid">
        <div class="navbar-brand" href="#">Image Gallery</div>
        
        <div class="nav navbar-form navbar-right">
            <b-button variant="default" v-on:click="showSelectFolder">
                Select Folder
            </b-button>
        </div>
</div>
    </b-navbar>

    <div class="container-fluid">
        <Thumbnails :path="selectedPath" />
    </div>
    <SelectFolder ref="select_folder" v-on:pathSelected="pathSelected"/>
  </div>
</template>

<script>
import bNavbar from 'bootstrap-vue/components/navbar.vue'
import bNavItem from 'bootstrap-vue/components/nav-item.vue'
import bNav from 'bootstrap-vue/components/nav.vue'
import bButton from 'bootstrap-vue/components/button.vue'

import Thumbnails from './components/Thumbnails'
import SelectFolder from './components/SelectFolder'

export default {
  name: 'app',
  components: {
      bNavbar,
      bNavItem,
      bNav,
      bButton,
      Thumbnails,
      SelectFolder
  },
  data: function() {
      return {
          selectedPath: document.location.pathname
      }
  },
  methods: {
      pathSelected: function(path) {
          this.selectedPath = path;
          window.history.pushState({path: path}, '', path);
      },
      showSelectFolder: function() {
          this.$refs.select_folder.show();
      }
  },
  created: function() {
      var self = this;
      
      window.addEventListener('popstate', () => {
          self.selectedPath = window.location.pathname
      })
  },
  mounted: function() {
      if (this.selectedPath == '/') {
          this.$refs.select_folder.show();
      }
  }
}

</script>

<style>
body {
    padding-top:50px;
}
</style>
