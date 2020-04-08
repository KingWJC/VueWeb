<template>
  <div class="expert-audit-view">
    <router-view name="filter"></router-view>
    <router-view name="manage"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "expert-audit-view",

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
