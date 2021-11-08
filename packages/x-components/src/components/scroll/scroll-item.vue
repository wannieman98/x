<template>
  <NoElement :data-scroll="item.id">
    <slot />
  </NoElement>
</template>
<script lang="ts">
  import { Identifiable } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { XInject } from '../decorators/injection.decorators';
  import { NoElement } from '../no-element';

  @Component({
    components: { NoElement }
  })
  export default class ScrollItem extends Vue {
    @Prop({ required: true })
    public item!: Identifiable;

    @XInject('scrollTo')
    public scrollTo!: string | null;

    @XInject('firstVisibleItemObserver')
    public firstVisibleItemObserver!: IntersectionObserver | null;

    async mounted(): Promise<void> {
      await this.$nextTick();
      this.firstVisibleItemObserver?.observe(this.$el);
      if (this.scrollTo === this.item.id) {
        this.$el.scrollIntoView();
      }
    }

    beforeDestroy(): void {
      this.firstVisibleItemObserver?.unobserve(this.$el);
    }
  }
</script>

<docs lang="mdx"></docs>
