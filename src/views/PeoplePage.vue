<template>
  <div>
    <Topbar @searchInput="searchedValue" />
    <v-system-bar color="secondary_vue">
      <Filterbar
        @clickedValue="clickedStatus"
        :departments="departments"
        pageName="pplPage"
      />
    </v-system-bar>
    <br />
    <div>
      <div class="float-right mr-6">
        <v-btn color="secondary_vue" class="mt-5" @click="handleClick('add')">
          <v-icon small>mdi-plus</v-icon>
          Add
        </v-btn>
      </div>
      <v-expansion-panels :value="0">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span> Admins & Agents</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-data-table
              :headers="agentTableHeaders"
              :items="filteredAgentsArr"
              hide-default-footer
              disable-pagination
              v-if="agentsArr.length != 0"
              @click:row="handleClick"
            >
            </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels :value="0">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span> Users</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-data-table
              :headers="userTableHeaders"
              :items="filteredUsersArr"
              hide-default-footer
              v-if="usersArr.length != 0"
              @click:row="handleClick"
              disable-pagination
            >
            </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>
<script>
import Topbar from "../components/TopBar.vue";
import Filterbar from "../components/FilterBar.vue";
export default {
  data: () => ({
    agentTableHeaders: [
      { text: "Name", value: "name" },
      { text: "Email", value: "email" },
      { text: "Level", value: "level" },
      { text: "Department", value: "department" },
    ],
    userTableHeaders: [
      { text: "Name", value: "name" },
      { text: "Phone", value: "phone" },
      { text: "Email", value: "email" },
      { text: "Department", value: "department" },
    ],
    peopleArr: [],
    agentsArr: [],
    usersArr: [],
    agentsArray: [],
    usersArray: [],
    departments: [],
    searchText: "",
    pplStat: "true",
    pplDept: "",
  }),
  components: {
    Topbar,
    Filterbar,
  },
  async mounted() {
    const response = await fetch("https://softinfo.net.in/persons/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    var data = [];
    data = await response.json();
    this.peopleArr = [];
    this.agentsArr = [];
    this.usersArr = [];
    for (var i = 0; i <= data.length; i++) {
      if (data[i] != undefined) {
        this.peopleArr.push({
          name: data[i]["name"],
          id: data[i]["id"],
          phone: data[i]["phone"],
          email: data[i]["email"],
          level: data[i]["level"],
          isActive: data[i]["isActive"],
          department: data[i]["departmentName"],
          role: data[i]["role"],
          remarks: data[i]["remarks"],
          allowTickets: data[i]["allowTickets"],
        });
        this.departments.push(data[i]["departmentName"]);
        if (
          (data[i]["role"] == "agent" || data[i]["role"] == "admin") &&
          data[i]["isActive"] == true
        ) {
          this.agentsArr.push({
            name: data[i]["name"],
            id: data[i]["id"],
            phone: data[i]["phone"],
            email: data[i]["email"],
            level: data[i]["level"],
            isActive: data[i]["isActive"],
            department: data[i]["departmentName"],
            role: data[i]["role"],
            remarks: data[i]["remarks"],
            allowTickets: data[i]["allowTickets"],
          });
        } else if (data[i]["role"] == "user" && data[i]["isActive"] == true) {
          this.usersArr.push({
            name: data[i]["name"],
            id: data[i]["id"],
            phone: data[i]["phone"],
            email: data[i]["email"],
            level: data[i]["level"],
            isActive: data[i]["isActive"],
            department: data[i]["departmentName"],
            role: data[i]["role"],
            remarks: data[i]["remarks"],
            allowTickets: data[i]["allowTickets"],
          });
        }
      }
    }
    this.agentsArray = this.agentsArr;
    this.usersArray = this.usersArr;
    this.peopleArray = this.peopleArr;
  },
  computed: {
    filteredAgentsArr() {
      return this.peopleArr.filter((agent) => {
        return (
          (agent.role == "agent" ||
            agent.role == "admin" ||
            agent.role == "admin") &&
          (agent.name.toLowerCase().indexOf(this.searchText.toLowerCase()) >
            -1 ||
            agent.email.toLowerCase().indexOf(this.searchText.toLowerCase()) >
              -1 ||
            agent.level
              .toString()
              .toLowerCase()
              .indexOf(this.searchText.toLowerCase()) > -1 ||
            agent.department
              .toLowerCase()
              .indexOf(this.searchText.toLowerCase()) > -1) &&
          (this.pplStat != "all"
            ? agent.isActive.toString() == this.pplStat
            : agent.isActive.toString() != this.pplStat) &&
          (this.pplDept != ""
            ? agent.department == this.pplDept
            : agent.department != this.pplDept)
        );
      });
    },
    filteredUsersArr() {
      return this.peopleArr.filter((user) => {
        return (
          user.role == "user" &&
          (user.name.toLowerCase().indexOf(this.searchText.toLowerCase()) >
            -1 ||
            user.email.toLowerCase().indexOf(this.searchText.toLowerCase()) >
              -1 ||
            user.phone
              .toString()
              .toLowerCase()
              .indexOf(this.searchText.toLowerCase()) > -1) &&
          (this.pplStat != "all"
            ? user.isActive.toString() == this.pplStat
            : user.isActive.toString() != this.pplStat) &&
          (this.pplDept != ""
            ? user.department == this.pplDept
            : user.department != this.pplDept)
        );
      });
    },
  },

  methods: {
    clickedStatus(data) {
      this.agentsArr = this.agentsArray;
      this.usersArr = this.usersArray;
      this.peopleArr = this.peopleArray;
      if (data["typeOfEvent"] == "userStatus") {
        this.pplStat = data["userStatus"];
      } else if (data["typeOfEvent"] == "dept") {
        this.pplDept = data["dept"];
      }
    },

    searchedValue(src) {
      this.searchText = src;
    },
    handleClick(row) {
      if (row == "add") {
        let row = [];
        let filteredDepts = [...new Set(this.departments)];
        row["departments"] = filteredDepts;
        row["pageType"] = "add";
        this.$router.replace({
          name: "UpdatePpl",
          params: { row },
        });
      } else {
        let filteredDepts = [...new Set(this.departments)];
        row["departments"] = filteredDepts;
        row["pageType"] = "edit";
        this.$router.replace({
          name: "UpdatePpl",
          params: { row },
        });
      }
    },
  },
};
</script>
