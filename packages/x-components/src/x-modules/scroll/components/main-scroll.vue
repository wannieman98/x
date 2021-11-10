<script lang="ts">
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { State } from '../../../components/decorators/store.decorators';
  import { XOn } from '../../../components/decorators/bus.decorators';
  import { XProvide } from '../../../components/decorators/injection.decorators';
  import { NoElement } from '../../../components/no-element';
  import { scrollXModule } from '../x-module';
  import { FirstVisibleItemObserverKey } from './scroll.const';
  import { ScrollVisibilityObserver } from './scroll.types';

  /**
   * Extends the scroll making it able to sync the first visible element, and allowing
   * the children position to be restored.
   */
  @Component({
    mixins: [xComponentMixin(scrollXModule)]
  })
  /* eslint-disable @typescript-eslint/unbound-method */
  export default class MainScroll extends NoElement {
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
    @Prop({ default: false, type: Boolean })
    public useWindow!: boolean;

    /**
     * Timeout in milliseconds to abort trying to restore the scroll position to the target
     * element.
     *
     * @public
     */
    @Prop({ default: 5000 })
    public restoreScrollTimeoutMs!: number;

    /**
     * Intersection percentage to consider an element visible.
     *
     * @public
     */
    @Prop({ default: 0.5 })
    public threshold!: number;

    /**
     * Adjusts the size of the scroll container bounds.
     *
     * @public
     */
    @Prop()
    public margin?: string;

    /**
     * If true (default), sets the scroll position to top when an
     * {@link XEventsTypes.UserAcceptedAQuery} event is emitted.
     *
     * @public
     */
    @Prop({
      type: Boolean,
      default: true
    })
    protected resetOnQueryChange!: boolean;

    /**
     * The elements that are currently considered visible.
     *
     * @internal
     */
    protected intersectingElements: HTMLElement[] = [];

    /**
     * Stores the identifier of the timeout that will consider the scroll failed to restore.
     *
     * @internal
     */
    protected restoreScrollFailTimeoutId?: number;

    /**
     * Intersection observer to determine visibility of the elements.
     *
     * @internal
     */
    protected intersectionObserver: IntersectionObserver | null =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(this.updateVisibleElements, {
            root: this.useWindow ? undefined : this.$el,
            threshold: this.threshold
          });

    /**
     * Pending identifier scroll position to restore. If it matches the {@link MainScrollItem.item}
     * `id` property, this component should be scrolled into view.
     *
     * @internal
     */
    @State('scroll', 'pendingScrollTo')
    public pendingScrollTo!: string;

    /**
     * Creates an `IntersectionObserver` to detect the first visible elements. Children of this
     * component should register themselves if they want to be observed.
     *
     * @returns The intersection observer.
     * @public
     */
    @XProvide(FirstVisibleItemObserverKey)
    public get firstVisibleElementObserver(): ScrollVisibilityObserver | null {
      const observer = this.intersectionObserver;
      return observer
        ? {
            observe: observer.observe.bind(observer),
            unobserve: element => {
              this.removeVisibleElement(element);
              observer.observe(element);
            }
          }
        : null;
    }

    /**
     * The first visible element contained in this component.
     *
     * @returns The first visible element in this component.
     * @internal
     */
    protected get firstVisibleElement(): HTMLElement | null {
      return this.intersectingElements.length === 0
        ? null
        : this.intersectingElements.reduce((firstVisibleElement, anotherElement) => {
            // FIXME: This algorithm only takes into account LTR layouts
            const firstVisibleElementBounds = firstVisibleElement.getBoundingClientRect();
            const anotherElementBounds = anotherElement.getBoundingClientRect();
            return anotherElementBounds.left <= firstVisibleElementBounds.left &&
              anotherElementBounds.top <= firstVisibleElementBounds.top
              ? anotherElement
              : firstVisibleElement;
          });
    }

    /**
     * Updates the visible elements given a list of intersection observer entries.
     *
     * @param entries - The entries from whom update the visibility.
     * @internal
     */
    protected updateVisibleElements(entries: IntersectionObserverEntry[]): void {
      entries.forEach(entry => {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          this.intersectingElements.push(target);
        } else {
          this.removeVisibleElement(target);
        }
      });
    }

    /**
     * Emits the first visible element `[data-scroll]`.
     *
     * @param element - The first visible element or `null` if there aren't any.
     * @internal
     */
    @Watch('firstVisibleElement')
    protected emitFirstVisibleElement(element: HTMLElement | null): void {
      this.$x.emit('UserScrolledToElement', element?.dataset.scroll ?? '');
    }

    /**
     * Disconnects the {@link VisibilityObserver.intersectionObserver}.
     *
     * @internal
     */
    beforeDestroy(): void {
      this.intersectionObserver?.disconnect();
      this.$x.emit('UserScrolledToElement', '');
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
        (this.useWindow ? window : this.$el).scrollTo({ top: 0 });
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
      // TODO Move this logic to the wiring. A cancelable delay operator is needed
      clearTimeout(this.restoreScrollFailTimeoutId);
      if (pendingScrollTo) {
        this.restoreScrollFailTimeoutId = setTimeout(() => {
          this.$x.emit('ScrollRestoreFailed');
        }, this.restoreScrollTimeoutMs);
      }
    }

    /**
     * Removes an element from the {@link MainScroll.intersectingElements} list.
     *
     * @param element - The element to remove from the visible elements.
     * @internal
     */
    protected removeVisibleElement(element: HTMLElement): void {
      const index = this.intersectingElements.indexOf(element);
      if (index !== -1) {
        this.intersectingElements.splice(index, 1);
      }
    }
  }
</script>

<docs lang="mdx">
## Events

## See it in action
</docs>
