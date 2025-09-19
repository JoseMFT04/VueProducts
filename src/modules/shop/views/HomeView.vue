<template>
  <!-- Title -->
  <div class="pt-30 bg-white py-9">
    <h1 class="text-center text-3xl font-bold text-gray-800">Productos</h1>
  </div>

  <div v-if="!products" class="text-center h-[500px]">
    <h1 class="text-xl">Cargando productos</h1>
    <p>Espere por favor</p>
  </div>

  <!-- Product List -->
  <product-list v-else :products="products" />

  <button-pagination :has-more-data="!!products && products.length < 12" :page="page" />
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import ButtonPagination from '@/modules/common/components/ButtonPagination.vue';
import { getProductsAction } from '@/modules/products/actions';
import ProductList from '@/modules/products/components/ProductList.vue';

const route = useRoute();
const page = ref(Number(route.query.page || 1));
const queryClient = useQueryClient();

console.log({ page });

const { data: products = [] } = useQuery({
  queryKey: ['products', { page: page }],
  queryFn: () => getProductsAction(page.value),
});

watch(
  () => route.query.page,
  (newPage) => {
    page.value = Number(newPage || 1);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
);

watchEffect(() => {
  queryClient.prefetchQuery({
    queryKey: ['products', { page: page.value + 1 }],
    queryFn: () => getProductsAction(page.value + 1),
  });
});
</script>
