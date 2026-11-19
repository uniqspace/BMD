<script setup lang="ts">
import 'swiper/css'
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue';
import TheFooter from './components/TheFooter.vue';

</script>

<template>
  <TheHeader />
  <!-- Tablet/desktop: the page slides up over the footer, which stays in place underneath (see TheFooter) -->
  <div class="relative z-10 flow-root bg-white md:border-b md:border-[#18181814]">
    <RouterView />
  </div>
  <TheFooter />
</template>

