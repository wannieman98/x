import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { UrlParams } from '../../types/url-params';
import { XOn } from '../decorators/bus.decorators';
import { XProvide } from '../decorators/injection.decorators';

@Component
/* eslint-disable @typescript-eslint/unbound-method */
export default class MainScrollMixin extends Vue {
  /**
   * The reference to the HTML node that has the scroll.
   *
   * @public
   */
  public $el!: HTMLElement;
  /**
   * If `true`, sets this scroll instance to the main of the application. Being the main
   * scroll implies that features like restoring the scroll when the query changes, or storing
   * the scroll position in the URL will be enabled for this container.
   *
   * @public
   */
  @Prop({ default: false })
  public main!: boolean;
  /**
   * Timeout in milliseconds to abort trying to restore the scroll position to the target
   * element.
   */
  @Prop({ default: 5000 })
  public restoreScrollTimeoutMs!: number;
  /**
   * The `[data-scroll]` value of the element that the component will try to scroll into view.
   *
   * @internal
   */
  @XProvide('scrollTo')
  public scrollTo: string | null = null;
  /**
   * If true (default), sets the scroll position to top when an
   * {@link XEventsTypes.UserAcceptedAQuery} event is emitted.
   *
   * @public
   */
  @Prop({
    type: Boolean,
    default(this: { main: boolean }) {
      return this.main;
    }
  })
  protected resetOnQueryChange!: boolean;

  public restoreScrollFailTimeoutId?: number;

  mounted(): void {
    if (!this.$el) {
      // TODO Replace with Empathy's logger
      // eslint-disable-next-line no-console
      console.warn(
        '[MainScrollMixin]',
        'Components using this mixin must set `this.$el` to the HTML node that is scrolling.'
      );
    }
  }

  /**
   * Resets the scroll position.
   *
   * @internal
   */
  @XOn([
    'SearchBoxQueryChanged',
    'SortChanged',
    'SelectedFiltersChanged',
    'SelectedRelatedTagsChanged'
  ])
  resetScroll(): void {
    if (this.resetOnQueryChange) {
      this.$el?.scrollTo({ top: 0 });
    }
  }

  /**
   * Saves the `[data-scroll]` value that should try to be restored.
   *
   * @param urlParams - The URL parameters, where the `scroll` information is stored.
   * @internal
   */
  @XOn('ParamsLoadedFromUrl')
  setScrollTo({ scroll }: UrlParams): void {
    /* FIXME: If the scroll component is destroyed and remounted this logic will be executed again,
     trying to scroll */
    if (this.main && scroll) {
      this.scrollTo = scroll;
    }
  }

  @Watch('scrollTo')
  failRestoringScroll(scrollTo: string | null): void {
    clearTimeout(this.restoreScrollFailTimeoutId);
    if (scrollTo) {
      this.restoreScrollFailTimeoutId = setTimeout(() => {
        scrollTo = null;
      });
    }
  }
}
