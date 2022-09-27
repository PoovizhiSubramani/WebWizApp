<template>
  <div>
    <Topbar @searchInput="searchedValue" />
    <v-system-bar color="secondary_vue">
      <Filterbar
        @clickedValue="clickedStatus"
        departments="[]"
        pageName="deptPage"
      />
    </v-system-bar>
    <br />
    <div class="float-right mr-6">
      <v-btn color="secondary_vue" class="mt-5" @click="handleClick('add')">
        <v-icon small>mdi-plus</v-icon>
        Add
      </v-btn>
    </div>
    <br />
    <br /><br />
    <v-data-table
      :headers="tableHeaders"
      :items="filteredDepartmentsArr"
      hide-default-footer
      disable-pagination
      v-if="departmentsArr.length != 0"
      @click:row="handleClick"
      class="v-expansion-panel-content__wrap"
    >
    </v-data-table>
  </div>
</template>
<script>
import Topbar from "../components/TopBar.vue";
import Filterbar from "../components/FilterBar.vue";
export default {
  data: () => ({
    tableHeaders: [
      { text: "Name", value: "name" },
      { text: "Levels", value: "levels" },
      { text: "Escalation Rule", value: "escalationRule" },
      { text: "Status", value: "status" },
    ],
    departmentsArr: [],
    searchText: "",
    activeArray: [],
    inactiveArray: [],
    allArray: [],
    condition: "active",
  }),
  components: {
    Topbar,
    Filterbar,
  },
  async mounted() {
    this.fetchValues("inactive");
    this.fetchValues("active");
  },
  updated() {
    if (this.activeArray.length != 0 && this.inactiveArray.length != 0) {
      this.allArray = this.activeArray.concat(this.inactiveArray);
    }
  },
  computed: {
    filteredDepartmentsArr() {
      // var arr = [];
      // arr = this.allArray;
      // if (this.condition == "active") {
      //   arr = this.activeArray;
      // } else if (this.condition == "inactive") {
      //   arr = this.inactiveArray;
      // }
      return this.departmentsArr.filter((dept) => {
        return (
          dept.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 ||
          dept.escalationRule
            .toString()
            .toLowerCase()
            .indexOf(this.searchText.toLowerCase()) > -1 ||
          dept.levels
            .toString()
            .toLowerCase()
            .indexOf(this.searchText.toLowerCase()) > -1 ||
          dept.status
            .toString()
            .toLowerCase()
            .indexOf(this.searchText.toLowerCase()) > -1
        );
      });
    },
  },
  methods: {
    async fetchValues(condition) {
      var stat = "";
      if (condition == "active") {
        stat = "?status=active";
      } else if (condition == "inactive") {
        stat = "?status=inactive";
      }
      const response = await fetch(
        "https://softinfo.net.in/departments/" + stat,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      var data = [];
      data = await response.json();
      this.departmentsArr = [];
      for (var i = 0; i <= data.length; i++) {
        if (data[i] != undefined) {
          this.departmentsArr.push({
            id: data[i]["id"],
            name: data[i]["name"],
            levels: data[i]["levels"],
            escalationRule: data[i]["autoEscalate"],
            remarks: data[i]["remarks"],
            allowUsersToCreateTickets: data[i]["allowUsersToCreateTickets"],
            escalationInDays: data[i]["escalationInDays"],
            escalationValue: data[i]["escalationValue"],
          });

          if (data[i]["isActive"] == true) {
            this.departmentsArr[i]["status"] = true;
          } else {
            this.departmentsArr[i]["status"] = false;
          }
        }
      }
      if (condition == "active") {
        this.activeArray = this.departmentsArr;
      } else if (condition == "inactive") {
        this.inactiveArray = this.departmentsArr;
      }
    },
    clickedStatus(data) {
      if (data["userStatus"] == "true") {
        this.condition = "active";
        this.fetchValues("active");
      } else if (data["userStatus"] == "false") {
        this.condition = "inactive";
        this.fetchValues("inactive");
      } else {
        this.departmentsArr = this.allArray;
      }
    },
    searchedValue(src) {
      this.searchText = src;
    },
    handleClick(row) {
      if (row == "add") {
        let row = [];
        row["pageType"] = "add";
        this.$router.replace({
          name: "UpdateDept",
          params: { row },
        });
      } else {
        row["pageType"] = "edit";
        this.$router.replace({
          name: "UpdateDept",
          params: { row },
        });
      }
    },
  },
};
</script>
