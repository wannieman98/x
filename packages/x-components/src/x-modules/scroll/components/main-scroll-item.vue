<template>
  <component :is="tag" :data-scroll="item.id">
    <slot />
  </component>
</template>
<script lang="ts">
  import { Identifiable } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State, xComponentMixin } from '../../../components';
  import { XInject } from '../../../components/decorators/injection.decorators';
  import { NoElement } from '../../../components/no-element';
  import { scrollXModule } from '../x-module';
  import { FirstVisibleItemObserverKey } from './scroll.const';
  import { ScrollVisibilityObserver } from './scroll.types';

  /**
   * Wrapper for elements contained in the {@link MainScroll} that should store/restore its
   * position.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(scrollXModule)],
    components: { NoElement }
  })
  export default class MainScrollItem extends Vue {
    /**
     * The item data. Used to set the scroll identifier.
     *
     * @public
     */
    @Prop({ required: true })
    public item!: Identifiable;

    /**
     * The tag to render.
     *
     * @public
     */
    @Prop({ default: 'NoElement' })
    public tag!: string;

    /**
     * Pending identifier scroll position to restore. If it matches the {@link MainScrollItem.item}
     * `id` property, this component should be scrolled into view.
     *
     * @internal
     */
    @State('scroll', 'pendingScrollTo')
    public pendingScrollTo!: string;

    /**
     * Observer to detect the first visible element.
     *
     * @internal
     */
    @XInject(FirstVisibleItemObserverKey)
    public firstVisibleItemObserver!: ScrollVisibilityObserver | null;

    /**
     * Initialise scroll behavior.
     * - Observes the rendered element to detect if it is the first visible item.
     * - If the rendered element matches the {@link MainScrollItem.pendingScrollTo}, scrolls the
     * element into the first position of the view.
     *
     * @internal
     */
    async mounted(): Promise<void> {
      await this.$nextTick(); // Mounted does not guarantee that child components are mounted too
      this.firstVisibleItemObserver?.observe(this.$el as HTMLElement);
      if (this.pendingScrollTo === this.item.id) {
        this.$el.scrollIntoView();
        this.$x.emit('ScrollRestoreSucceeded');
      }
    }

    /**
     * Detaches the observer from the rendered element to prevent memory leaks.
     *
     * @internal
     */
    beforeDestroy(): void {
      this.firstVisibleItemObserver?.unobserve(this.$el as HTMLElement);
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

To do so, it usually works with the `Scroll`, and `URLHandler` components.

```vue
<template>
  <div>
    <SearchInput />
    <Scroll main>
      <ResultsList #result="{ item }">
        <ScrollItem :item="item">
          <img :src="item.images[0]" />
          <p>{{ item.title }}</p>
        </ScrollItem>
      </ResultsList>
    </Scroll>
  </div>
</template>

<script>
  import { Scroll, ScrollItem } from '@empathyco/x-components';
  import { ResultsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'ScrollItemDemo',
    components: {
      Scroll,
      ResultsList,
      ScrollItem,
      SearchInput
    }
  };
</script>
```
</docs>
