<template>
  <div>
    <Topbar @searchInput="searchedValue" />
    <v-system-bar color="secondary_vue">
      <Filterbar
        @clickedValue="clickedDept"
        :departments="departmentNames"
        pageName="ticketPage"
      />
    </v-system-bar>
    <div class="float-right mr-6">
      <v-btn color="secondary_vue" class="mt-5" @click="editTemplate('add')">
        <v-icon small>mdi-plus</v-icon>
        Add
      </v-btn>
    </div>
    <br /><br /><br />
    <div v-if="templateArr.length != 0" class="row">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        :value="template.id"
        class="col-6"
      >
        <v-card class="mx-auto">
          <v-row>
            <v-col class="col-3" style="text-align: center">
              <v-col class="vertical_center">
                <v-icon x-large>mdi-domain</v-icon>
                <br />
                {{ template.departmentName }}
              </v-col>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col class="col-7" style="text-align: center">
              <v-card-text>
                <p class="text-h5 text--primary">
                  {{ template.name }}
                </p>
                <div class="text--primary temp_subject">
                  {{ template.subject }}
                </div>
                <p class="mt-3">{{ template.remarks }}</p>
              </v-card-text>
            </v-col>
            <v-col class="col-2 align_center">
              <v-col class="vertical_center px-0">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
                  </template>
                  <v-list>
                    <v-list-item @click="editTemplate(template)">
                      <v-icon small>mdi-pencil</v-icon>&nbsp; Edit
                    </v-list-item>
                    <v-list-item @click="deleteTemplate(template)">
                      <v-icon small>mdi-delete</v-icon>&nbsp; Delete
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </div>
    <v-dialog v-model="showDeleteModal" width="500">
      <v-card-title class="text-h5 lighten-2"> Delete </v-card-title>
      <v-card-text> Delete Template?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="confirmDelete"> Ok </v-btn>
      </v-card-actions>
    </v-dialog>
  </div>
</template>
<script>
import Topbar from "../components/TopBar.vue";
import Filterbar from "../components/FilterBar.vue";
export default {
  data: () => ({
    departments: [],
    departmentNames: [],
    selectedDept: "",
    templateArr: [],
    searchText: "",
    showDeleteModal: false,
    templateId: "",
  }),
  components: {
    Topbar,
    Filterbar,
  },
  async mounted() {
    const response = await fetch("https://softinfo.net.in/ticketTemplates/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    var data = [];
    data = await response.json();
    this.templateArr = [];
    for (var i = 0; i <= data.length; i++) {
      if (data[i] != undefined) {
        this.templateArr.push({
          id: data[i]["id"],
          name: data[i]["name"],
          departmentCode: data[i]["departmentCode"],
          departmentName: data[i]["departmentName"],
          remarks: data[i]["remarks"],
          subject: data[i]["subject"],
        });
        this.departments.push({
          value: data[i]["departmentCode"],
          text: data[i]["departmentName"],
        });
        this.departmentNames.push(data[i]["departmentName"]);
      }
    }
  },
  computed: {
    filteredTemplates() {
      return this.templateArr.filter((temp) => {
        return (
          (temp.name.toLowerCase().indexOf(this.searchText.toLowerCase()) >
            -1 ||
            temp.departmentName
              .toLowerCase()
              .indexOf(this.searchText.toLowerCase()) > -1 ||
            temp.remarks.toLowerCase().indexOf(this.searchText.toLowerCase()) >
              -1 ||
            temp.subject.toLowerCase().indexOf(this.searchText.toLowerCase()) >
              -1) &&
          (this.selectedDept != ""
            ? temp.departmentName == this.selectedDept
            : temp.departmentName != this.selectedDept)
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
      if (row == "add") {
        let row = [];
        let filteredDepts = [...new Set(this.departments)];
        row["departments"] = filteredDepts;
        row["pageType"] = "add";
        this.$router.replace({
          name: "UpdateTemplate",
          params: { row },
        });
      } else {
        let filteredDepts = [...new Set(this.departments)];
        row["departments"] = filteredDepts;
        row["pageType"] = "edit";
        this.$router.replace({
          name: "UpdateTemplate",
          params: { row },
        });
      }
    },
    deleteTemplate(template) {
      this.showDeleteModal = true;
      this.templateId = template.id;
    },
    async confirmDelete() {
      const response = await fetch(
        "https://softinfo.net.in/ticketTemplates/?templateID=" +
          this.templateId,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      if (response.status == 200) {
        this.showDeleteModal = false;
        this.$router.push("/tickets");
      }
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
