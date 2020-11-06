import { SimpleFilter } from '@empathy/search-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getSimpleFilterStub } from '../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../__tests__/utils';
import BaseSimpleFilter from '../filters/base-simple-filter.vue';

function renderBaseSimpleFilter({
  template = '<BaseSimpleFilter :filter="filter"/>',
  filter = getSimpleFilterStub()
}: BaseSimpleFilterWrapperData = {}): BaseSimpleFilterAPI {
  Vue.observable(filter);
  const emit = jest.fn();
  const wrapper = mount(
    {
      components: { BaseSimpleFilter },
      props: ['filter'],
      template
    },
    {
      propsData: {
        filter
      },
      mocks: {
        $x: {
          emit
        }
      }
    }
  );

  return {
    wrapper,
    emit,
    filter,
    clickFilter() {
      wrapper.trigger('click');
    },
    selectFilter() {
      filter.selected = true;
      return Vue.nextTick();
    }
  };
}

describe('testing BaseSimpleFilter component', () => {
  it('renders the provided filter by default', () => {
    const { wrapper, filter } = renderBaseSimpleFilter();

    expect(wrapper.text()).toEqual(filter.title);
  });

  it('emits UserClickedAFilter event when clicked', () => {
    const { wrapper, clickFilter, emit, filter } = renderBaseSimpleFilter();

    clickFilter();

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith('UserClickedAFilter', filter, {
      target: wrapper.element
    });
  });

  it('allows customizing the rendered content with an slot', () => {
    const { wrapper, filter } = renderBaseSimpleFilter({
      template: `
      <BaseSimpleFilter :filter="filter" v-slot="{ filter }">
        <span data-test="custom-label">{{ filter.title }}</span>
      </BaseSimpleFilter>
      `
    });

    const customLabel = wrapper.find(getDataTestSelector('custom-label'));
    expect(customLabel.text()).toEqual(filter.title);
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { wrapper, selectFilter } = renderBaseSimpleFilter();

    expect(wrapper.classes()).not.toContain('x-filter--is-selected');
    expect(wrapper.classes()).not.toContain('x-simple-filter--is-selected');

    await selectFilter();

    expect(wrapper.classes()).toContain('x-filter--is-selected');
    expect(wrapper.classes()).toContain('x-simple-filter--is-selected');
  });
});

interface BaseSimpleFilterWrapperData {
  template?: string;
  filter?: SimpleFilter;
}

interface BaseSimpleFilterAPI {
  wrapper: Wrapper<Vue>;
  emit: jest.Mock<any, any>;
  filter: SimpleFilter;
  clickFilter: () => void;
  selectFilter: () => Promise<void>;
}