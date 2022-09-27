<template>
  <v-container class="form_vue">
    <v-app-bar app color="secondary_vue">
      <span class="ml-3 mr-3">
        <v-icon @click="navBack">mdi-arrow-left</v-icon>
      </span>
      <div>
        <v-toolbar-title v-if="typeAdd">Add User</v-toolbar-title>
        <v-toolbar-title v-else>User Details</v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
      <span class="mr-3" v-if="!typeAdd">
        <v-icon @click="showDeactivateModal = true"
          >mdi-minus-circle-outline</v-icon
        >
      </span>
    </v-app-bar>
    <v-form ref="form" class="row add_edit_vue" v-if="showLogin">
      <div class="col-3"></div>
      <div class="col-6">
        <div class="align_center">
          <h1>First, enter their account details...</h1>
        </div>
        <br /><br />
        <v-text-field
          v-model="email"
          label="New Email"
          :prepend-icon="'mdi-email-outline'"
          required
        ></v-text-field>
        <v-text-field
          v-model="addPassword"
          :prepend-icon="'mdi-key'"
          :append-icon="
            showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
          "
          label="New Password"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          required
        ></v-text-field>
        <br /><br />
        <div class="align_center">
          <v-btn color="primary_vue" @click="navNext" class="v-btn--round" fab>
            <v-icon large>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
        <v-snackbar v-model="showEmailError">
          {{ emailErrorMessage }}
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
      </div>
    </v-form>
    <v-form ref="form" class="col-8 add_edit_vue" v-else>
      <v-layout> Name </v-layout>
      <v-text-field
        v-model="name"
        prepend-inner-icon="mdi-file-document"
        class="icon_prepend_tf"
      ></v-text-field>
      <v-layout> Phone Number </v-layout>
      <v-text-field
        v-model="phoneNumber"
        prepend-inner-icon="mdi-file-document"
        class="icon_prepend_tf"
      ></v-text-field>
      <v-layout> Department </v-layout>
      <v-layout>
        <v-select
          :items="deptOptions"
          v-model="selectedDept"
          outlined
          class="select_vue icon_prepend_tf"
          prepend-inner-icon="mdi-domain"
        ></v-select>
      </v-layout>
      <v-layout> Role </v-layout>
      <v-layout>
        <v-select
          :items="roleOptions"
          item-text="text"
          item-value="value"
          v-model="selectedRole"
          outlined
          class="select_vue icon_prepend_tf"
          prepend-inner-icon="mdi-briefcase-account"
        ></v-select>
      </v-layout>
      <v-layout> Level </v-layout>
      <v-text-field
        v-model="level"
        type="number"
        prepend-inner-icon="mdi-file-document"
        class="icon_prepend_tf"
        min="1"
      ></v-text-field>
      <v-layout> Remarks </v-layout>
      <v-text-field
        v-model="remarks"
        prepend-inner-icon="mdi-file-document"
        class="icon_prepend_tf"
      ></v-text-field>
      <v-layout>
        Can open tickets
        <v-spacer></v-spacer>
        <input type="checkbox" :checked="allowTickets" v-model="allowTickets" />
      </v-layout>
      <br />
      <div class="align_center">
        <v-btn color="primary_vue" class="mt-5" @click="addEditSubmit">
          Submit
        </v-btn>
        <br /><br />
        <div
          style="text-decoration: underline"
          @click="changePasswordModal = true"
          v-if="!typeAdd"
        >
          Change their password
        </div>
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
    <v-dialog v-model="showDeactivateModal" width="500">
      <v-card-title class="text-h5 lighten-2"> Deactivate </v-card-title>
      <v-card-text> Deactivate User?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="showDeactivateModal = false">
          Cancel
        </v-btn>
        <v-btn color="primary" text @click="deactivateUser"> Ok </v-btn>
      </v-card-actions>
    </v-dialog>
    <v-dialog v-model="changePasswordModal" width="500">
      <v-card-text>
        <v-alert text outlined color="info" icon="mdi-alert" v-if="showError">
          Password cannot be empty
        </v-alert>
        <v-text-field
          label="Password"
          class="mt-4"
          v-model="password"
          required
          :prepend-icon="'mdi-keyboard'"
          :append-icon="
            showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
          "
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          @input="showError = false"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="changePassword"> Confirm </v-btn>
        <v-btn color="primary" text @click="changePasswordModal = false">
          Back
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
    userId: "",
    name: "",
    phoneNumber: "",
    email: "",
    deptOptions: [],
    selectedDept: "",
    roleOptions: [
      {
        text: "Admin",
        value: "admin",
      },
      {
        text: "Agent",
        value: "agent",
      },
      {
        text: "User",
        value: "user",
      },
    ],
    selectedRole: "",
    level: "",
    remarks: "",
    allowTickets: false,
    isActive: true,
    showSuccessModal: false,
    showDeactivateModal: false,
    changePasswordModal: false,
    showPassword: false,
    password: "",
    showError: false,
    typeAdd: false,
    showLogin: false,
    addPassword: "",
    method: "",
    successText: "",
    showStatusError: false,
    errorMessage: [],
    typeOfError: "",
    showEmailError: false,
    emailErrorMessage: "",
  }),
  mounted() {
    if (this.$route.params.row.pageType == "add") {
      this.typeAdd = true;
      this.showLogin = true;
      this.deptOptions = this.$route.params.row.departments;
      this.selectedRole = "admin";
    } else {
      this.userId = this.$route.params.row.id;
      this.name = this.$route.params.row.name;
      this.phoneNumber = this.$route.params.row.phone;
      this.email = this.$route.params.row.email;
      this.selectedDept = this.$route.params.row.department;
      this.deptOptions = this.$route.params.row.departments;
      this.selectedRole = this.$route.params.row.role;
      this.level = this.$route.params.row.level;
      this.remarks = this.$route.params.row.remarks;
      this.allowTickets = this.$route.params.row.allowTickets;
      this.isActive = this.$route.params.row.isActive;
    }
  },
  methods: {
    navBack() {
      this.showSuccessModal = false;
      this.$router.push("/people");
    },
    async addEditSubmit() {
      var formData = {};
      formData["id"] = this.typeAdd ? "" : this.userId;
      formData["name"] = this.name;
      formData["email"] = this.email;
      formData["phone"] = this.phoneNumber;
      formData["remarks"] = this.remarks;
      formData["departmentName"] = this.selectedDept;
      formData["role"] = this.selectedRole;
      formData["allowTickets"] = this.allowTickets;
      formData["isActive"] = this.isActive;
      formData["level"] = Number(this.level);
      if (this.typeAdd == true) {
        formData["isAvailable"] = true;
        formData["password"] = this.addPassword;
        this.method = "POST";
      } else {
        this.method = "PUT";
      }
      const response = await fetch("https://softinfo.net.in/persons/", {
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
    deactivateUser() {
      this.isActive = false;
      this.showDeactivateModal = false;
    },
    async changePassword() {
      if (this.password == "") {
        this.showError = true;
        return;
      } else {
        this.showError = false;
        const response = await fetch(
          "https://softinfo.net.in/persons/userChangePassword",
          {
            method: "PUT",
            body: '"' + this.password + '"',
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          }
        );
        if (response.status == 200) {
          this.showSuccessModal = true;
          this.successText = "Edited";
        }
      }
    },
    navNext() {
      if (this.email != "" && this.addPassword != "") {
        if (
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            this.email
          ) == false
        ) {
          this.emailErrorMessage = "Enter a valid Email Address";
          this.showEmailError = true;
        } else {
          this.showLogin = false;
          this.typeAdd = true;
        }
      } else {
        if (this.email == "") this.emailErrorMessage = "Email cannot be empty";
        if (this.addPassword == "")
          this.emailErrorMessage = "Password cannot be empty";
        this.showEmailError = true;
      }
    },
  },
};
</script>
<style scoped>
.btn_round {
  border-radius: 50%;
}
</style>
