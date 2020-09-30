import { createLocalVue } from '@vue/test-utils';
import { ComponentOptions, default as Vue } from 'vue';
import VueRouter from 'vue-router';
import { Store } from 'vuex';
import { XPlugin } from '../../../plugins/x-plugin';
import { PrivateXModulesOptions, XConfig, XModulesOptions } from '../../../plugins/x-plugin.types';
import { SearchAdapterDummy } from '../../../__tests__/adapter.dummy';
import { InstallXOptions } from '../types';
import { XInstaller } from '../x-installer';

describe('testing `XInstaller` utility', () => {
  const adapter = SearchAdapterDummy;
  const xPluginMock = { install: jest.fn() };
  const plugin = (xPluginMock as unknown) as XPlugin;
  const store = ({} as unknown) as Store<any>;
  const xModules = ({} as unknown) as XModulesOptions;
  const __PRIVATE__xModules = ({} as unknown) as PrivateXModulesOptions;
  const component: ComponentOptions<Vue> = {
    render(h) {
      return h('div');
    },
    mounted: jest.fn()
  };

  const snippetConfig = {
    instance: 'test',
    lang: 'test',
    scope: 'test'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('installs the XPlugin with all the passed plugin parameters', () => {
    new XInstaller({
      adapter,
      plugin,
      store,
      xModules,
      __PRIVATE__xModules,
      vue: createLocalVue()
    }).init(snippetConfig);
    const params = xPluginMock.install.mock.calls[0][1];

    expect(xPluginMock.install).toHaveBeenCalledTimes(1);
    expect(params.adapter).toEqual(adapter);
    expect(params.store).toEqual(store);
    expect(params.xModules).toEqual(xModules);
    expect(params.__PRIVATE__xModules).toEqual(__PRIVATE__xModules);
  });

  it('installs the XPlugin with the passed XConfig', () => {
    const xConfig = {
      consent: true,
      documentDirection: 'rtl',
      currencyOptions: { symbol: '&' }
    } as XConfig;
    new XInstaller({ adapter, plugin, xConfig, vue: createLocalVue() }).init(snippetConfig);
    const params = xPluginMock.install.mock.calls[0][1];

    expect(params.xConfig.consent).toBe(xConfig.consent);
    expect(params.xConfig.documentDirection).toBe(xConfig.documentDirection);
    expect(params.xConfig.currencyOptions.symbol).toBe(xConfig.currencyOptions.symbol);
  });

  it('installs the XPlugin using the snippet config over the default', () => {
    const xConfig = {
      consent: true,
      documentDirection: 'rtl',
      currencyOptions: { symbol: '&' }
    } as XConfig;
    new XInstaller({ adapter, plugin, xConfig, vue: createLocalVue() }).init({
      ...snippetConfig,
      consent: false,
      documentDirection: 'ltr'
    });
    const params = xPluginMock.install.mock.calls[0][1];

    expect(params.xConfig.consent).toBe(false);
    expect(params.xConfig.documentDirection).toBe('ltr');
  });

  it('creates the public API in global scope by default', () => {
    delete window.X;
    new XInstaller({ adapter, plugin, vue: createLocalVue() }).init(snippetConfig);

    expect(window.X).toBeDefined();
    delete window.X;
  });

  it('does not create the public API passing the api parameter to false', () => {
    new XInstaller({ adapter, plugin, api: false, vue: createLocalVue() }).init(snippetConfig);

    expect(window.X).not.toBeDefined();
  });

  it('installs the XPlugin using the passed vue', () => {
    const localVue = createLocalVue();
    new XInstaller({ adapter, plugin, vue: localVue }).init(snippetConfig);
    const vueParam = xPluginMock.install.mock.calls[0][0];

    expect(xPluginMock.install).toHaveBeenCalledTimes(1);
    expect(vueParam).toBe(localVue);
  });

  it('creates a Vue application using the component passed in the app option', () => {
    new XInstaller({ adapter, plugin, app: component, vue: createLocalVue() }).init(snippetConfig);

    // eslint-disable-next-line  @typescript-eslint/unbound-method
    expect(component?.mounted).toHaveBeenCalledTimes(1);
  });

  it('creates a Vue application using the `vueOptions` passed', () => {
    const testMethod = jest.fn();
    const vue = createLocalVue();
    vue.use(VueRouter);
    const vueOptions: InstallXOptions['vueOptions'] = {
      router: new VueRouter({}),
      methods: { testMethod }
    };
    const { app } = new XInstaller({
      adapter,
      vue,
      vueOptions,
      app: component
    }).init(snippetConfig);

    expect(app).toHaveProperty('testMethod');
    expect(app).toHaveProperty('$router');
  });
});