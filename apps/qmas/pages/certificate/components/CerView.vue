<template>
  <div class="cer-view">
    <router-view></router-view>
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  export default {
    name: "cer-view",

    data() {
      return {};
    },

    computed: {
      isActive() {
        return this.$route.name;
      }
    },

    created() {
      Axios.get(resolveApiRoute("cer-exist")).then((res) => {
        if (res.data.Code === 0) {
          this.$router.push({
            path: "/CerDetail"
          });
        } else {
          this.$router.push({
            path: "/CerList"
          });
        }
      });
    }
  };
</script>
