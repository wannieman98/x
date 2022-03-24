export interface TailwindHelpers {
  addUtilities: any;
  matchUtilities: any;
  addComponents: (components: Record<string, any>) => void;
  matchComponents: any;
  addBase: any;
  addVariant: any;
  e: any;
  prefix: any;
  theme: (key: string) => string;
  variants: any;
  config: any;
  postcss: any;
}

/**
 * Makes all the properties of the T type optional in depth.
 *
 * @param T - The type to make all its properties in depth optional.
 * @public
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends NonPrimitive
    ? T[P] extends AnyFunction
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};

/**
 * TypeScript type non-primitives. Array or Record with all possible types.
 *
 * @public
 */
export type NonPrimitive = Array<any> | Record<any, any>;

/**
 * TypeScript type primitives. Basically every type possible except objects or arrays.
 *
 * @public
 */
export type Primitive = string | number | boolean | undefined | null | symbol | AnyFunction;

/**
 * A function with 0 or more parameters of any type, which can return something or not.
 *
 * @public
 */
export type AnyFunction = (...args: any[]) => any;
