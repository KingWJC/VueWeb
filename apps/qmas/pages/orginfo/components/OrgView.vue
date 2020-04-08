<template>
  <div class="org-view">
    <router-view name="filter"></router-view>
    <router-view name="info"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "org-view",

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
