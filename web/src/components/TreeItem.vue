<template>
<li>
    <div>
      <div class="badge">
      <span class="folder-icon glyphicon"
        v-on:click="toggle" 
        v-bind:class="{ 'glyphicon-folder-open': open, 'glyphicon-folder-close': !open }">
        </span>
       </div>
            
      <div v-on:click="show" class="btn btn-default">
          <span v-on:click="show" class="glyphicon glyphicon-eye-open"></span>
          {{model.name}}
      </div>
      
      <div class="btn btn-default" v-on:click="toggle">
          <span class="glyphicon" v-bind:class="{'glyphicon-minus' : open, 'glyphicon-plus': !open}">
      </span>
      </div>
      
    </div>
    <ul v-show="open">
      <TreeItem
        class="item"
        v-for="child in children"
        :model="child"
        v-on:pathSelected="pathSelected"
        >
      </TreeItem>
    </ul>
</li>
</template>

<script>
export default {
  name: 'TreeItem',
  props: {
    model: Object,
  },
  data: function () {
    return {
      open: false,
      children: []
    }
  },
  methods: {
    toggle: function () {
        this.open = !this.open
        if (this.open) {
            this.$http.get('/api/folders.json?path=' + this.model.path).then((response) => {
                this.children = response.body;
            }, (response) => {
                // error callback
            });
        }
    },
    show: function() {
        this.pathSelected(this.model.path);
    },
    pathSelected: function(path) {
        this.$emit('pathSelected', path);
    }
  }
}
</script>

<style scoped>
ul {
    list-style:none;
    padding-left:20px;
}
li {
    list-style:none;
    margin-top:5px;
}
.folder-icon {
    padding:2px;
}
</style>
