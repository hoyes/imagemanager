<template>
<b-modal ref="dialog">
    <div slot="modal-header">
        <button type="button" class="close" data-dismiss="modal" v-on:click="close">
            <span class="glyphicon glyphicon-remove"></span>
        </button>
        <h4 class="modal-title">Select Folder</h4>
    </div>
    <div slot="modal-body">
        <Tree v-on:pathSelected="pathSelected"/>
    </div>
</b-modal>
</template>

<script>
import bModal from 'bootstrap-vue/components/modal.vue'
import Tree from './Tree'

export default {
  name: 'SelectFolder',
  components: {
      Tree,
      bModal
  },
  methods: {
      show: function() {
          this.$refs.dialog.show();
      },
      close: function() {
          this.$refs.dialog.hide();
      },
      pathSelected: function(path) {
          this.$emit('pathSelected', path);
          this.close();
      }
  }
}
</script>
