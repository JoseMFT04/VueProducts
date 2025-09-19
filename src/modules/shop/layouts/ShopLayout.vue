<template>
  <!-- Header Navbar -->
  <top-menu />

  <!-- RouterView -->
  <router-view />

  <!-- Footer -->
  <custom-footer class="bottom-0 left-0 w-full bg-gray-800 text-white p-4" />
</template>

<script setup lang="ts">
import CustomFooter from '../components/CustomFooter.vue';
import TopMenu from '../components/TopMenu.vue';
</script>
