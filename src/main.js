import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";
import Login from "./views/LoginPage.vue";
import Dept from "./views/DepartmentPage.vue";
import People from "./views/PeoplePage.vue";
import Tickets from "./views/TicketTemplatesPage.vue";
import Messenger from "./views/MessengerPage.vue";
import UpdateDept from "./components/AddEditDepartment.vue";
import UpdatePpl from "./components/AddEditUser.vue";
import UpdateTemplate from "./components/AddEditTemplate.vue";
import UpdateMessenger from "./components/AddEditMessenger.vue";

Vue.config.productionTip = false;

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    component: Login,
    beforeEnter(to, from, next) {
      if (localStorage.getItem("access_token")) {
        next();
      } else {
        next("/");
      }
    },
  },
  { path: "/department", component: Dept },
  { path: "/people", component: People },
  { path: "/tickets", component: Tickets },
  { path: "/messenger", component: Messenger },
  {
    path: "/department/add_edit_department",
    component: UpdateDept,
    name: "UpdateDept",
    props: true,
  },
  {
    path: "/people/add_edit_user",
    component: UpdatePpl,
    name: "UpdatePpl",
    props: true,
  },
  {
    path: "/tickets/add_edit_template",
    component: UpdateTemplate,
    name: "UpdateTemplate",
    props: true,
  },
  {
    path: "/messenger/add_edit_email_template",
    component: UpdateMessenger,
    name: "UpdateMessenger",
    props: true,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
