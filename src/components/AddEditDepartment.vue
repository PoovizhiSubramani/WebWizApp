<template>
  <v-container class="form_vue">
    <v-app-bar app color="secondary_vue">
      <span class="ml-3 mr-3">
        <v-icon @click="navBack">mdi-arrow-left</v-icon>
      </span>
      <div>
        <v-toolbar-title v-if="typeAdd">Department Details</v-toolbar-title>
        <v-toolbar-title v-else>Add Department </v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
      <span class="mr-3" v-if="!typeAdd">
        <v-icon @click="showDeactivateModal = true"
          >mdi-minus-circle-outline</v-icon
        >
      </span>
    </v-app-bar>
    <h2 class="font-weight-medium">Enter the details of the new department</h2>

    <v-form ref="form" class="col-8 add_edit_vue">
      <v-layout> Name </v-layout>
      <v-text-field
        v-model="name"
        prepend-inner-icon="mdi-file-document"
        class="icon_prepend_tf"
      ></v-text-field>
      <v-layout> Level </v-layout>
      <v-text-field
        v-model="level"
        prepend-inner-icon="mdi-file-document"
        class="icon_prepend_tf"
        type="number"
        min="0"
      ></v-text-field>
      <v-layout> Remarks </v-layout>
      <v-text-field
        v-model="remarks"
        prepend-inner-icon="mdi-file-document"
        class="icon_prepend_tf"
      ></v-text-field>
      <v-layout>
        Allow Users to Create Tickets
        <v-spacer></v-spacer>
        <input
          type="checkbox"
          :checked="allowUsersToCreateTickets"
          v-model="allowUsersToCreateTickets"
        /> </v-layout
      ><br />
      <v-layout>
        Allow auto-escalation
        <v-spacer></v-spacer>
        <input
          type="checkbox"
          :checked="escalationRule"
          v-model="escalationRule"
        /> </v-layout
      ><br />
      <v-layout>
        Auto-escalate after
        <v-spacer></v-spacer>
        <v-text-field
          v-model="escalationValue"
          id="number_field"
          hide-details
          type="number"
          solo
          style="width: 40px"
          min="0"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-select
          :items="timeOptions"
          v-model="selectedTimeBand"
          outlined
          class="select_vue"
        ></v-select>
      </v-layout>
      <br />
      <div class="align_center">
        <v-btn color="primary_vue" class="mt-5" @click="addEditSubmit">
          Submit
        </v-btn>
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
    <v-dialog v-model="showSuccessModal" width="500">
      <v-card-title class="text-h5 lighten-2"> Success </v-card-title>
      <v-card-text> {{ successText }} Successfully </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="navBack"> Ok </v-btn>
      </v-card-actions>
    </v-dialog>
    <v-dialog v-model="showDeactivateModal" width="500">
      <v-card-title class="text-h5 lighten-2"> Deactivate </v-card-title>
      <v-card-text> Deactivate Department?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="showDeactivateModal = false">
          Ok
        </v-btn>
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
    deptId: "",
    name: "",
    level: "",
    remarks: "",
    isActive: true,
    allowUsersToCreateTickets: true,
    escalationRule: true,
    escalationValue: 0,
    timeOptions: ["hours", "days"],
    selectedTimeBand: "",
    showSuccessModal: false,
    showDeactivateModal: false,
    typeAdd: false,
    method: "",
    successText: "",
    showStatusError: false,
    errorMessage: "",
    typeOfError: "",
  }),
  mounted() {
    if (this.$route.params.row.pageType == "add") {
      this.typeAdd = true;
    } else {
      this.deptId = this.$route.params.row.id;
      this.name = this.$route.params.row.name;
      this.level = this.$route.params.row.levels;
      this.remarks = this.$route.params.row.remarks;
      this.isActive = this.$route.params.row.status;
      this.allowUsersToCreateTickets =
        this.$route.params.row.allowUsersToCreateTickets;
      this.selectedTimeBand = this.$route.params.row.escalationInDays
        ? "days"
        : "hours";
      this.escalationRule = this.$route.params.row.escalationRule;
      this.escalationValue = this.$route.params.row.escalationValue;
    }
  },
  methods: {
    navBack() {
      this.showSuccessModal = false;
      this.$router.push("/department");
    },
    async addEditSubmit() {
      var formData = {};
      formData["id"] = this.typeAdd == true ? "" : this.deptId;
      formData["name"] = this.name;
      formData["isActive"] = this.isActive;
      formData["remarks"] = this.remarks;
      formData["levels"] = Number(this.level);
      formData["allowUsersToCreateTickets"] = this.allowUsersToCreateTickets;
      formData["autoEscalate"] = this.escalationRule;
      formData["escalationInDays"] =
        this.selectedTimeBand == "days" ? true : false;
      formData["escalationValue"] = Number(this.escalationValue);
      if (this.typeAdd == true) {
        this.method = "POST";
      } else {
        this.method = "PUT";
      }
      const response = await fetch("https://softinfo.net.in/departments/", {
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
  },
};
</script>
