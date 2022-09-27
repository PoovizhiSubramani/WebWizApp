<template>
  <v-container>
    <div v-if="pageName == 'loginPage'" style="margin-top: 12%">
      <v-row class="text-center">
        <v-col class="mb-4">
          <h2 class="display-2 font-weight-bold mb-3">Welcome to Tickets</h2>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="col-3"></v-col>
        <v-form ref="form" class="col-6 login_vue">
          <v-text-field
            v-model="email"
            :prepend-icon="'mdi-email-outline'"
            :rules="[(v) => !!v || 'Email is required']"
            label="Email"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            :prepend-icon="'mdi-key'"
            :append-icon="
              showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
            "
            :rules="[(v) => !!v || 'Password is required']"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            required
          ></v-text-field>

          <div class="align_center">
            <v-btn color="primary_vue" class="mt-5" @click="loginUser">
              Login
            </v-btn>
          </div>
        </v-form>

        <v-snackbar v-model="showError">
          {{ errorMessage }}
          <template v-slot:action="{ attrs }">
            <v-btn color="info" text v-bind="attrs" @click="showError = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-row>
    </div>
    <div v-else-if="pageName == 'adminPage'">
      <router-view :key="$route.path"></router-view>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "LoginPage",

  data: () => ({
    pageName: "loginPage",
    email: "",
    password: "",
    showPassword: false,
    errorMessage: "",
    showError: false,
  }),
  methods: {
    async loginUser() {
      const response = await fetch("https://softinfo.net.in/login", {
        method: "POST",
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          deviceMake: "Apple",
          deviceModel: "iPhone X",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const body = await response.json();
      if (response.status == 200) {
        this.showError = false;
        localStorage.setItem("access_token", body.access_token);
        this.pageName = "adminPage";
        this.$router.push("/department");
      } else if (response.status == 422) {
        this.showError = true;
        this.errorMessage = "Invalid login credentials";
      } else if (response.status == 401) {
        this.showError = true;
        this.errorMessage = "Incorrect email or password";
      }
    },
  },
};
</script>
<style scoped>
.v-input__control .v-input__slot .v-text-field__slot input {
  padding-left: 10px !important;
}
</style>
