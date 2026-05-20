/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
/// <reference types="node" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveValue(value: string | number): R;
      toHaveClass(className: string): R;
      toBeChecked(): R;
      toBeDisabled(): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}

export {};
