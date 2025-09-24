<template>
  <!-- Header Navbar -->
  <top-menu />

  <!-- RouterView -->
  <router-view />

  <!-- Footer -->
  <custom-footer />
</template>

<script setup lang="ts">
import CustomFooter from '../components/CustomFooter.vue';
import TopMenu from '../components/TopMenu.vue';
</script>
