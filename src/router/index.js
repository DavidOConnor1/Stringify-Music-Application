import { createRouter, createWebHistory } from "vue-router";
import Signin from "@/componets/Signin.vue";
import MainBody from "@/componets/MainBody.vue";
import Signup from "@/componets/Signup.vue";
import Songs from "@/componets/profile/Songs.vue";
import Artists from "@/componets/Artists.vue";
import profile from "@/componets/profile/profile.vue";
import beArtist from "@/componets/profile/beArtist.vue";
import MusicSearch from "@/componets/api/MusicSearch.vue";
import MusicDashboard from "@/componets/api/MusicDashboard.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: MainBody,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/songs",
    name: "Songs",
    component: Songs,
  },
  {
    path: "/artists",
    name: "Artists",
    component: Artists,
  },
  {
    path: "/profile",
    name: "Profile",
    component: profile
  },
  {
    path: "/beartist",
    name: "beArtist",
    component: beArtist
  },
  {
    path: "/music-search",
    name: "MusicSearch",
    component: MusicSearch
  },
  {
    path: "/musicDashboard",
    name: "MusicDashBoard",
    component: MusicDashboard
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
