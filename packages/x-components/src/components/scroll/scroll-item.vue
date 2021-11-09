<template>
  <NoElement :data-scroll="item.id">
    <slot />
  </NoElement>
</template>
<script lang="ts">
  import { Identifiable } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import SearchInput from '../../x-modules/search-box/components/search-input.vue';
  import ResultsList from '../../x-modules/search/components/results-list.vue';
  import { XInject } from '../decorators/injection.decorators';
  import { NoElement } from '../no-element';
  import BaseIdScroll from './base-id-scroll.vue';
  import { FirstVisibleItemObserverKey, PendingScrollTo } from './scroll.const';

  /**
   * Wrapper for elements that can store/restore its position.
   */
  @Component({
    components: { SearchInput, ResultsList, BaseIdScroll, NoElement }
  })
  export default class ScrollItem extends Vue {
    /**
     * The item data. Used to set the scroll identifier.
     */
    @Prop({ required: true })
    public item!: Identifiable;

    /**
     * Pending identifier scroll position to restore. If it matches the {@link ScrollItem.item} `id`
     * property, this component should be scrolled into view.
     */
    @XInject(PendingScrollTo)
    public scrollTo!: string | null;

    /**
     * Observer to detect the first visible element.
     */
    @XInject(FirstVisibleItemObserverKey)
    public firstVisibleItemObserver!: IntersectionObserver | null;

    /**
     * Initialise scroll behavior.
     * - Observes the rendered element to detect if it is the first visible item.
     * - If the rendered element matches the {@link ScrollItem.scrollTo}, scrolls the element into
     * the first position of the view.
     */
    async mounted(): Promise<void> {
      await this.$nextTick(); // Mounted does not guarantee that child components are mounted too
      this.firstVisibleItemObserver?.observe(this.$el);
      if (this.scrollTo === this.item.id) {
        this.$el.scrollIntoView();
        this.$x.emit('ScrollRestored', this.scrollTo);
      }
    }

    /**
     * Detaches the observer from the rendered element to prevent memory leaks.
     */
    beforeDestroy(): void {
      this.firstVisibleItemObserver?.unobserve(this.$el);
    }
  }
</script>

<docs lang="mdx">
## Events

This components emits the following events:

- [`ScrollRestored`](./../../api/x-components.xeventstypes.md)

## See it in action

This component has no template. It renders whatever you decide. It's purpose is to help storing and
restoring the scroll position so URLs can be shared, and to allow users to smoothly navigate back
and forth.

To do so, it usually works with the `BaseIdScroll`, and `URLHandler` components.

```vue
<template>
  <div>
    <SearchInput />
    <BaseIdScroll main>
      <ResultsList #result="{ item }">
        <ScrollItem :item="item">
          <img :src="item.images[0]" />
          <p>{{ item.title }}</p>
        </ScrollItem>
      </ResultsList>
    </BaseIdScroll>
  </div>
</template>

<script>
  import { BaseIdScroll, ScrollItem } from '@empathyco/x-components';
  import { ResultsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'ScrollItemDemo',
    components: {
      BaseIdScroll,
      ResultsList,
      ScrollItem,
      SearchInput
    }
  };
</script>
```
</docs>
