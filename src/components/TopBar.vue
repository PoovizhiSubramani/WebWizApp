<template>
  <div>
    <v-app-bar app color="secondary_vue">
      <div>
        <v-toolbar-title>Admin</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>
      <v-autocomplete
        v-model="search"
        :items="items"
        clearable
        item-text="name"
        item-value="id"
        label="Search"
        solo
        class="mr-3 search_vue"
        @input.native="searchFromTable"
      ></v-autocomplete>
      <span class="mr-3">
        <v-icon @click="reloadPage">mdi-refresh</v-icon>
      </span>
    </v-app-bar>
    <v-tabs centered icons-and-text>
      <v-tabs-slider></v-tabs-slider>
      <v-tab to="/department">
        Departments
        <v-icon>mdi-domain-plus</v-icon>
      </v-tab>
      <v-tab to="/people">
        People
        <v-icon>mdi-account-multiple</v-icon>
      </v-tab>
      <v-tab to="/tickets">
        Ticket Templates
        <v-icon>mdi-sticker-outline</v-icon>
      </v-tab>
      <v-tab to="/messenger">
        Messenger
        <v-icon>mdi-email-outline</v-icon>
      </v-tab>
    </v-tabs>
  </div>
</template>
<script>
export default {
  data: () => ({
    search: "",
    items: [],
  }),
  methods: {
    reloadPage() {
      window.location.reload();
    },
    searchFromTable(e) {
      this.$emit("searchInput", e.target.value);
    },
  },
};
</script>
