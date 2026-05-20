import LoginVIew from "@/views/loginVIew.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/loginVIew.vue"),
      meta: { requiersNotAuth: true },
    },
    {
      path: "/home",
      name: "home",
      component: () => import("@/views/homeView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/registerView.vue"),
      meta: { requiersNotAuth: true },
    },

    {
      path: "/review",
      name: "review",
      component: () => import("@/views/reviewView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !localStorage.getItem("access_token")) {
    return { name: "login" };
  } else if (to.meta.requiersNotAuth && localStorage.getItem("access_token")) {
    return { name: "home" };
  } else {
    return true;
  }
});

export default router;
