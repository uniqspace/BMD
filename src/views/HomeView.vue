<script setup lang="ts">
import { onUnmounted } from 'vue';
import SingersArchive from '@/components/SingersArchive.vue';
import SingersCategoryList from '@/components/SingersCategoryList.vue';
import { useCategoryStore } from '@/store/category';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const categoryStore = useCategoryStore()

onUnmounted(() => {
  categoryStore.setCurrentCategory('viewAll')
})
</script>

<template>
  <main>
    <div class="container">
      <div class="mt-5 mb-15 md:mb-17.5 lg:mb-25 lg:mt-15">
        <h1 v-html="t('home.title')" class="tracking-tighter text-[41px]/[100%] sm:text-[62px]/[100%] lg:text-[70px]/[100%]" />
      </div>

      <SingersCategoryList />
      <SingersArchive />
    </div>
  </main>
</template>
