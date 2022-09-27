<template>
  <div>
    <Topbar @searchInput="searchedValue" />
    <div v-if="messengerArr.length != 0" class="row">
      <div
        v-for="msg in filteredMessenger"
        :key="msg.id"
        :value="msg.id"
        class="col-6"
      >
        <v-card class="mx-auto">
          <v-row>
            <v-col class="col-10 align_center">
              <v-card-text>
                <p class="text-h5 text--primary">
                  On <span class="capitalize">{{ msg.event }} </span>
                </p>
                <div class="text--primary temp_subject">
                  {{ msg.subject }}
                </div>
                <p class="mt-3">{{ msg.body }}</p>
              </v-card-text>
            </v-col>
            <v-col class="col-2 align_center">
              <v-col class="vertical_center">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
                  </template>
                  <v-list>
                    <v-list-item @click="editTemplate(msg)">
                      <v-icon small>mdi-pencil</v-icon>&nbsp; Edit
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script>
import Topbar from "../components/TopBar.vue";
export default {
  data: () => ({
    departments: [],
    deptsForFilter: [],
    selectedDept: "",
    messengerArr: [],
    searchText: "",
    showDeleteModal: false,
    messengerId: "",
  }),
  components: {
    Topbar,
  },
  async mounted() {
    const response = await fetch("https://softinfo.net.in/emailTemplates/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    var data = [];
    data = await response.json();
    this.messengerArr = [];
    for (var i = 0; i <= data.length; i++) {
      if (data[i] != undefined) {
        this.messengerArr.push({
          id: data[i]["id"],
          body: data[i]["body"],
          event: data[i]["event"],
          isActive: data[i]["isActive"],
          subject: data[i]["subject"],
        });
        // this.deptsForFilter.push(data[i]["departmentName"]);
        // this.departments.push({
        //   value: data[i]["departmentCode"],
        //   text: data[i]["departmentName"],
        // });
      }
      if (i == 0) this.selectedDept = data[i]["departmentName"];
    }
  },
  computed: {
    filteredMessenger() {
      return this.messengerArr.filter((temp) => {
        return (
          temp.body.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 ||
          temp.event.toLowerCase().indexOf(this.searchText.toLowerCase()) >
            -1 ||
          temp.subject.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
        );
      });
    },
  },
  methods: {
    clickedDept(value) {
      this.selectedDept = value.dept;
    },
    searchedValue(src) {
      this.searchText = src;
    },
    editTemplate(row) {
      this.$router.replace({ name: "UpdateMessenger", params: { row } });
    },
  },
};
</script>
<style scoped>
.vertical_center {
  top: 50%;
  transform: translateY(-50%);
  position: relative;
}
.temp_subject {
  font-size: 1.3em;
}
</style>
