<template>
  <v-container class="form_vue">
    <v-app-bar app color="secondary_vue">
      <span class="ml-3 mr-3">
        <v-icon @click="navBack">mdi-arrow-left</v-icon>
      </span>
      <div>
        <v-toolbar-title v-if="typeAdd"
          >Add a new Ticket Template</v-toolbar-title
        >
        <v-toolbar-title v-else>Edit Template</v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
      <span class="mr-3" v-if="!typeAdd">
        <v-icon @click="showDeleteModal = true">mdi-delete</v-icon>
      </span>
    </v-app-bar>
    <v-form ref="form" class="col-8 add_edit_vue">
      <v-layout> Department </v-layout>
      <v-layout>
        <v-select
          :items="deptOptions"
          v-model="selectedDepartment"
          outlined
          class="select_vue icon_prepend_tf"
          prepend-inner-icon="mdi-domain"
        ></v-select>
      </v-layout>
      <v-layout> Name </v-layout>
      <v-text-field
        v-model="name"
        prepend-inner-icon="mdi-file-document"
        class="icon_prepend_tf"
      ></v-text-field>
      <v-layout> Subject </v-layout>
      <v-text-field
        v-model="subject"
        prepend-inner-icon="mdi-text"
        class="icon_prepend_tf"
      ></v-text-field>
      <v-layout> Remarks </v-layout>
      <v-text-field
        v-model="remarks"
        prepend-inner-icon="mdi-book-open"
        class="icon_prepend_tf"
      ></v-text-field>

      <br />
      <div class="align_center">
        <v-btn color="primary_vue" class="mt-5" @click="addEditSubmit">
          Submit
        </v-btn>
        <br />
      </div>
    </v-form>
    <v-snackbar v-model="showStatusError">
      <div v-if="typeOfError == 'object'">
        <div v-for="(error, i) in errorMessage" :key="i">
          <p class="capitalize">{{ error.loc[1] }}&nbsp;{{ error.msg }}</p>
        </div>
      </div>
      <div v-else>
        {{ errorMessage }}
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn
          color="info"
          text
          v-bind="attrs"
          @click="showStatusError = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog v-model="showSuccessModal" width="500" id="successModal">
      <v-card-title class="text-h5 lighten-2"> Success </v-card-title>
      <v-card-text> {{ successText }} Successfully </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="navBack"> Ok </v-btn>
      </v-card-actions>
    </v-dialog>
    <v-dialog v-model="showDeleteModal" width="500">
      <v-card-title class="text-h5 lighten-2"> Delete </v-card-title>
      <v-card-text> Delete Template?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="showDeleteModal = false">
          Cancel
        </v-btn>
        <v-btn color="primary" text @click="confirmDelete"> Ok </v-btn>
      </v-card-actions>
    </v-dialog>
  </v-container>
</template>
<script>
import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
export default {
  data: () => ({
    templateId: "",
    name: "",
    subject: "",
    remarks: "",
    deptOptions: [],
    selectedDepartment: "",
    showSuccessModal: false,
    showDeleteModal: false,
    typeAdd: false,
    method: "",
    successText: "",
    showStatusError: false,
    errorMessage: [],
    typeOfError: "",
  }),
  mounted() {
    if (this.$route.params.row.pageType == "add") {
      this.typeAdd = true;
      this.deptOptions = this.$route.params.row.departments;
    } else {
      this.templateId = this.$route.params.row.id;
      this.name = this.$route.params.row.name;
      this.subject = this.$route.params.row.subject;
      this.remarks = this.$route.params.row.remarks;
      this.deptOptions = this.$route.params.row.departments;
      this.selectedDepartment = this.$route.params.row.departmentCode;
    }
  },
  methods: {
    navBack() {
      this.showSuccessModal = false;
      this.$router.push("/tickets");
    },
    async addEditSubmit() {
      var formData = {};
      formData["id"] = this.typeAdd ? "" : this.templateId;
      formData["name"] = this.name;
      formData["subject"] = this.subject;
      formData["remarks"] = this.remarks;
      formData["departmentCode"] = this.selectedDepartment;
      if (this.typeAdd == true) {
        this.method = "POST";
      } else {
        this.method = "PUT";
      }
      const response = await fetch("https://softinfo.net.in/ticketTemplates/", {
        method: this.method,
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      const body = await response.json();
      if (response.status == 200) {
        this.showSuccessModal = true;
        this.successText = "Edited";
      } else if (response.status == 201) {
        this.showSuccessModal = true;
        this.successText = "Added";
      } else {
        this.errorMessage = body.detail;
        this.typeOfError = typeof this.errorMessage;
        this.showStatusError = true;
      }
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
        this.$router.push("/tickets");
      }
    },
  },
};
</script>
