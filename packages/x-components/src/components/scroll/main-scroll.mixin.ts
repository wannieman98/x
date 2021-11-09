import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { UrlParams } from '../../types/url-params';
import { XOn } from '../decorators/bus.decorators';
import { XProvide } from '../decorators/injection.decorators';
import { PendingScrollTo } from './scroll.const';

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
   * The last `[data-scroll]` element that has been restored.
   *
   * @internal
   */
  public lastRestoredScrollTo: string | null = null;
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
  /**
   * Stores the identifier of the timeout that will consider the scroll failed to restore.
   *
   * @internal
   */
  protected restoreScrollFailTimeoutId?: number;

  /**
   * Returns a `[data-scroll]` value if there is any pending scroll to restore.
   *
   * @returns A `[data-scroll]` value if the scroll is pending to restore, or `null` if it isn't.
   */
  @XProvide(PendingScrollTo)
  public get pendingScrollTo(): string | null {
    return this.scrollTo && this.scrollTo !== this.lastRestoredScrollTo ? this.scrollTo : null;
  }

  /**
   * Ensures that this mixin is applied on a valid component.
   *
   * @internal
   */
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
   * Sets the `[data-scroll]` that the scroll has been last restored to.
   *
   * @param lastRestoredScrollTo - The last position the scroll has been restored to.
   * @internal
   */
  @XOn('ScrollRestored')
  setLastRestoredScroll(lastRestoredScrollTo: string | null): void {
    this.lastRestoredScrollTo = lastRestoredScrollTo;
  }

  /**
   * Saves the `[data-scroll]` value that should try to be restored.
   *
   * @param urlParams - The URL parameters, where the `scroll` information is stored.
   * @internal
   */
  @XOn('ParamsLoadedFromUrl')
  setScrollTo({ scroll }: UrlParams): void {
    if (this.main && scroll) {
      this.scrollTo = scroll;
    }
  }

  /**
   * If there is a pending scroll, starts a countdown to stop trying to restore the scroll.
   *
   * @param pendingScrollTo - The position the scroll should be restored to.
   * @internal
   */
  @Watch('pendingScrollTo')
  protected failRestoringScroll(pendingScrollTo: string | null): void {
    clearTimeout(this.restoreScrollFailTimeoutId);
    if (pendingScrollTo) {
      this.restoreScrollFailTimeoutId = setTimeout(() => {
        pendingScrollTo = null;
      }, this.restoreScrollTimeoutMs);
    }
  }
}
