import StyleDictionary, { Config } from 'style-dictionary';
import { File } from 'style-dictionary/types/File';
import {
  androidFontBaseTransform,
  androidStringNoTranslatableTransform
} from './android-transforms';

StyleDictionary.registerTransform(androidStringNoTranslatableTransform);
StyleDictionary.registerTransform(androidFontBaseTransform);

const config: Config = {
  source: ['src/design-system/**/*.tokens.json'],
  platforms: {
    css: {
      prefix: 'x',
      transforms: ['name/cti/kebab'],
      files: [
        {
          format: 'css/variables',
          options: {
            outputReferences: true
          },
          destination: 'src/design-system/tokens.scss'
        }
      ]
    },
    android: {
      prefix: 'x',
      transforms: [
        'attribute/cti',
        'name/cti/camel',
        'color/hex8android',
        'size/dp',
        'size/sp',
        'android/string/no-translatable',
        'android/font/base'
      ],
      files: [
        {
          format: 'android/resources',
          options: {
            outputReferences: true
          },
          resourceMap: {
            size: 'dimen',
            color: 'color',
            string: 'string',
            content: 'string',
            time: 'integer',
            number: 'integer',
            font: 'font'
          },
          destination: 'android.tokens.xml'
        } as File
      ]
    },
    ios: {
      prefix: 'x',
      transformGroup: 'ios-swift',
      files: [
        {
          format: 'ios-swift/class.swift',
          options: {
            outputReferences: true
          },
          destination: 'ios.tokens.swift'
        } as File
      ]
    }
  }
};
const styleDictionaryBuilder = StyleDictionary.extend(config);

styleDictionaryBuilder.buildAllPlatforms();
