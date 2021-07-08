import { Transform } from 'style-dictionary';
import { Named } from 'style-dictionary/types/_helpers';

export const androidStringNoTranslatableTransform: Named<Transform> = {
  type: 'name',
  name: 'android/string/no-translatable',
  matcher: token => token.attributes?.category === 'string',
  transformer: token => token.name + '" translatable="false'
};

export const androidFontBaseTransform: Named<Transform> = {
  type: 'value',
  name: 'android/font/base',
  matcher: token => {
    return (
      token.attributes?.category === 'font' &&
      token.attributes?.type === 'family' &&
      token.attributes?.item === 'base'
    );
  },
  transformer: token =>
    `@font/${(token.value as string).toLowerCase().replace(/'/g, '').split(',')[0]}`
};
