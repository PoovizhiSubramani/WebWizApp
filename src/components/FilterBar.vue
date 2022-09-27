<template>
  <v-expansion-panels class="expansion_vue">
    <v-expansion-panel>
      <v-expansion-panel-header>
        <span> Filter</span>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div v-if="pageName == 'pplPage' || pageName == 'ticketPage'">
          <v-select
            :items="departments"
            label="Department"
            solo
            @change="filterData($event, 'dept')"
          ></v-select>
          <br />
        </div>
        <div v-if="pageName == 'pplPage' || pageName == 'deptPage'">
          <p>Status</p>
          <v-radio-group
            row
            @change="filterData($event, 'userStatus')"
            v-model="status"
          >
            <v-radio label="Active" value="true"></v-radio>
            <v-radio label="Inactive" value="false"></v-radio>
            <v-radio label="All" value="all"></v-radio>
          </v-radio-group>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
export default {
  props: ["departments", "pageName"],
  data: () => ({
    status: "true",
    filterDept: "",
  }),
  methods: {
    filterData(event, type) {
      let clickedValue = [{}];
      clickedValue["typeOfEvent"] = type;
      if (type == "dept") {
        clickedValue["dept"] = event;
      } else if (type == "userStatus") {
        clickedValue["userStatus"] = event;
      }
      this.$emit("clickedValue", clickedValue);
    },
  },
};
</script>
