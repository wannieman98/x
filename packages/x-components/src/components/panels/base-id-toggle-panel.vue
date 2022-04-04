<template>
  <BaseTogglePanel :open="isOpen" :animation="animation">
    <!-- @slot (Required) Default content -->
    <slot />
  </BaseTogglePanel>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { NoElement } from '../no-element';
  import { xComponentMixin } from '../x-component.mixin';
  import { panelXModule } from '../../x-modules/panels/x-module';
  import { State } from '../decorators/store.decorators';
  import BaseTogglePanel from './base-toggle-panel.vue';

  /**
   * Simple panel that could receives its initial open state via prop, if not the default is opens
   * and a required prop, named `panelId`, which are responsible of rendering default slot
   * inside a configurable transition.
   *
   * It reacts to `UserClickedPanelToggleButton` event, when their payload matches the component's
   * 'panelId' prop, to handle its open/close state.
   *
   * The default slot offers the possibility to customise the modal content.
   *
   * @public
   */
  @Component({
    components: {
      BaseTogglePanel
    },
    mixins: [xComponentMixin(panelXModule)]
  })
  export default class BaseIdTogglePanel extends Vue {
    /**
     * Shows the panel open at the beginning or not, depending on its state.
     *
     * @public
     */
    @Prop({ default: true })
    protected startOpen!: boolean;

    /** Whether the toggle panel is open or not. */
    protected isOpen = this.startOpen;

    /**
     * Animation component that will be used to animate the panel content.
     *
     * @public
     */
    @Prop({ default: () => NoElement })
    protected animation!: Vue;

    /**
     * The id to link with the BaseIdTogglePanelButton.
     * Both components must use the same Id to make them interact.
     */
    @Prop({ required: true })
    public panelId!: string;

    @Watch('openPanels')
    togglePanel(): void {
      this.isOpen = this.openPanels.includes(this.panelId);
    }

    @State('panel', 'open')
    public openPanels!: string[];

    /**
     * Emits the {@link XEventsTypes.TogglePanelStateChanged} event, when the internal state
     * changes.
     *
     * @remarks This event is necessary to link the state with the {@link BaseIdTogglePanelButton}
     * component.
     * @public
     */
    @Watch('isOpen', { immediate: true })
    emitStateEvent(): void {
      this.$x.emit('TogglePanelStateChanged', this.isOpen, {
        id: this.panelId,
        target: this.$el as HTMLElement
      });
    }
  }
</script>

<docs lang="mdx">
## Examples

### Basic usage

Using default slot:

```vue
<template>
  <div>
    <BaseIdTogglePanelButton panelId="myToggle">
      <img src="./open-button-icon.svg" />
      <span>Toggle Aside</span>
    </BaseIdTogglePanelButton>
    <BaseIdTogglePanel :startOpen="true" :animation="animation" panelId="myToggle">
      <div class="x-text">My toggle</div>
    </BaseIdTogglePanel>
  </div>
</template>

<script>
  import {
    BaseIdTogglePanel,
    BaseIdTogglePanelButton,
    CollapseFromTop
  } from '@empathyco/x-components';

  export default {
    components: {
      BaseIdTogglePanel,
      BaseIdTogglePanelButton,
      CollapseFromTop
    },
    data: function () {
      return {
        animation: CollapseFromTop
      };
    }
  };
</script>
```

## Events

A list of events that the component will watch:

- `UserClickedPanelToggleButton`: the event is emitted after the user clicks the button. The event
  payload is the id of the panelId that is going to be toggled.
</docs>
