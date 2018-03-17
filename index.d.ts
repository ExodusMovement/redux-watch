// Type definitions for redux-watch 1.1.1
// Project: https://github.com/jprichardson/redux-watch
// Definitions by melkir <https://github.com/melkir>

declare function watch<T>(
  getState: () => any,
  objectPath?: string | Array<string>,
  compare?: () => boolean
): IReturnFunction<T>;

// A generic interface for a function, which returns something
interface IReturnFunction<T> {
  (
    parameter: (
      newVal: T,
      oldVal: T,
      objectPath: string | Array<string>
    ) => void
  );
}

export = watch;
