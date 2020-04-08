<template>
  <div class="data-examine-view">
    <router-view name="filter"></router-view>
    <router-view name="manage"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "data-examine-view",

    data() {
      return {};
    },

    computed: {
      isActive() {
        return this.$route.name;
      }
    },

    methods: {}
  };
</script>
