<template>
  <div>
    <div v-for="color in colors" :key="color" :class="color" class="x-w-32 x-h-24 x-mb-16" />
    <button class="x-btn">
      <StarIcon />
      <span>x-btn</span>
      <span class="x-text-xl">BIG</span>
    </button>
    <button class="x-btn x-btn-lg x-btn-lead tablet:x-btn-md desktop:x-btn-sm">
      x-btn-lead
      <StarIcon />
    </button>
    <button class="x-btn x-btn-square x-btn-lg">
      <StarIcon />
    </button>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { StarIcon } from '../components/icons';

  @Component({
    components: {
      StarIcon
    }
  })
  export default class Tailwind extends Vue {
    protected colors = ['x-bg-lead', 'x-bg-auxiliary-200', 'x-bg-accent-200'];
  }
</script>

<style scoped lang="scss"></style>
