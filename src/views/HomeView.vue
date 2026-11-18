<script setup lang="ts">
import SingersArchive from '@/components/SingersArchive.vue';
import SingersCategoryList from '@/components/SingersCategoryList.vue';
import { useI18n } from 'vue-i18n'
import { onUnmounted } from 'vue'
import { useCategoryStore } from '@/store/category'
const { t } = useI18n()

// Reset the artist filter to its default when leaving the home page,
// so returning later always shows all artists (not the previous filter).
const categoryStore = useCategoryStore()
onUnmounted(() => {
  categoryStore.setCurrentCategory('viewAll')
})
</script>

<template>
  <main>
    <div class="container">
      <div class="mt-5 mb-15 md:mb-17.5 lg:mb-25 lg:mt-15">
        <h1 v-html="t('home.title')" class="text-[46px]/[0.95] tracking-[-1.8px] sm:text-[76px]/[0.93] sm:tracking-[-3px] md:text-[96px]/[0.92] md:tracking-[-3.8px] lg:text-[112px]/[0.92] lg:tracking-[-4.5px] xl:text-[128px]/[0.92] xl:tracking-[-5px]" />
      </div>

      <SingersCategoryList />
      <SingersArchive />

    </div>
  </main>
</template>
