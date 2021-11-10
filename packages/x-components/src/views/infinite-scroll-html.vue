<template>
  <BaseMainScroll>
    <UrlHandler />
    <h1>Infinite Scroll HTML</h1>
    <header class="header">
      <SearchInput />
    </header>
    <ResultsList #result="{ item }" v-infinite-scroll:html>
      <ScrollItem :item="item">
        <img :src="item.images[0]" />
        <p>{{ item.title }}</p>
      </ScrollItem>
    </ResultsList>
  </BaseMainScroll>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseMainScroll from '../x-modules/scroll/components/window-scroll.vue';
  import MainScrollItem from '../x-modules/scroll/components/main-scroll-item.vue';
  import { XInstaller } from '../x-installer/x-installer/x-installer';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import ResultsList from '../x-modules/search/components/results-list.vue';
  import { infiniteScroll } from '../directives/infinite-scroll/infinite-scroll';
  import UrlHandler from '../x-modules/url/components/url-handler.vue';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(_to, _from, next: () => void): void {
      new XInstaller(baseInstallXOptions).init(baseSnippetConfig);
      next();
    },
    components: {
      BaseMainScroll,
      UrlHandler,
      ScrollItem: MainScrollItem,
      ResultsList,
      SearchInput
    },
    directives: {
      'infinite-scroll': infiniteScroll
    }
  })
  export default class Search extends Vue {}
</script>

<style lang="scss">
  html {
    height: 100vh;
    max-height: 100%;
    overflow: auto;
  }

  .x-results-list {
    margin: 10px;
    border: 2px solid darkcyan;

    &__item {
      padding: 10px 0;

      &:nth-child(even) {
        background-color: lightgray;
      }
    }
  }
</style>
