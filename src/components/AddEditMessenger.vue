<template>
  <v-container class="form_vue">
    <v-app-bar app color="secondary_vue">
      <span class="ml-3 mr-3">
        <v-icon @click="navBack">mdi-arrow-left</v-icon>
      </span>
      <div class="mx-auto">
        <v-toolbar-title>Edit Messenger Template</v-toolbar-title>
      </div>
    </v-app-bar>
    <v-form ref="form" class="col-8 add_edit_vue">
      <v-layout> Trigger event </v-layout>
      <v-layout>
        <v-select
          :items="eventOptions"
          item-text="text"
          item-value="value"
          v-model="selectedEvent"
          outlined
          class="select_vue icon_prepend_tf"
          prepend-inner-icon="mdi-alarm"
          disabled
        ></v-select>
      </v-layout>
      <v-layout> Subject </v-layout>
      <v-text-field
        v-model="subject"
        prepend-inner-icon="mdi-text"
        class="icon_prepend_tf"
      ></v-text-field>
      <v-layout> Body </v-layout>
      <v-textarea
        v-model="body"
        prepend-inner-icon="mdi-book-open"
        class="icon_prepend_tf"
      ></v-textarea>
      <v-layout style="justify-content: center">
        <v-btn small color="primary_vue" class="mt-5"> Department </v-btn>&nbsp;
        <v-btn small color="primary_vue" class="mt-5"> Subject </v-btn>&nbsp;
        <v-btn small color="primary_vue" class="mt-5"> Remarks </v-btn>&nbsp;
      </v-layout>

      <br /><br /><br />
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
      <v-card-text> Edited Successfully </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="navBack"> Ok </v-btn>
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
    subject: "",
    body: "",
    eventOptions: [
      {
        text: "Assign",
        value: "assign",
      },
      {
        text: "Re-assign",
        value: "reassign",
      },
      {
        text: "Close",
        value: "close",
      },
    ],
    selectedEvent: "",
    isActive: true,
    showSuccessModal: false,
    showStatusError: false,
    errorMessage: "",
    typeOfError: "",
  }),
  mounted() {
    this.templateId = this.$route.params.row.id;
    this.isActive = this.$route.params.row.isActive;
    this.subject = this.$route.params.row.subject;
    this.body = this.$route.params.row.body;
    this.selectedEvent = this.$route.params.row.event;
  },
  methods: {
    navBack() {
      this.showSuccessModal = false;
      this.$router.push("/messenger");
    },
    async addEditSubmit() {
      var formData = {};
      formData["id"] = this.templateId;
      formData["event"] = this.selectedEvent;
      formData["subject"] = this.subject;
      formData["body"] = this.body;
      formData["isActive"] = this.isActive;
      const response = await fetch("https://softinfo.net.in/emailTemplates/", {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      const body = await response.json();
      if (response.status == 200) {
        this.showSuccessModal = true;
      } else {
        this.errorMessage = body.detail;
        this.typeOfError = typeof this.errorMessage;
        this.showStatusError = true;
      }
    },
  },
};
</script>
