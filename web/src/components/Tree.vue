<template>
<ul>
    <TreeItem ref="tree_root" :model="treeData" v-on:pathSelected="pathSelected">
    </TreeItem
</ul>
</template>

<script>
import TreeItem from './TreeItem'

export default {
  name: 'Tree',
  components: {
      TreeItem
  },
  data: function () {
    return {
      treeData: {
        name: 'Root',
        path: '/'
      }
    }
  },
  methods: {
      pathSelected: function(path) {
          this.$emit('pathSelected', path);
      }
  },
  mounted: function() {
      this.$refs.tree_root.toggle();
  }
}
</script>

<style scoped>
ul {
    list-style:none;
    padding:0;
    font-size:1.2em;
}
</style>
