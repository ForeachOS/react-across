import * as React from "react";
import { FallbackProps } from "react-error-boundary";

export type AcrossComponent<T extends {} = any> = React.FC<{ data: T }>;

function DefaultErrorFallback({ error }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error?.message}</pre>
    </div>
  );
}

export const defaultErrorBoundaryProps = { FallbackComponent: DefaultErrorFallback };

function lowercaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function getBackendProps<T extends {}>(el: HTMLElement): Partial<T> {
  if (el === null) return {};

  if (el.dataset["props"]) {
    return JSON.parse(el.dataset["props"]);
  }

  const propNames = Object.getOwnPropertyNames(el.dataset).filter((name) => name.startsWith("props"));

  return propNames.reduce<{ [x: string]: string | undefined }>((obj, name) => {
    const attrName = lowercaseFirstLetter(name.replace("props", ""));
    obj[attrName] = el.dataset[name];
    return obj;
  }, {}) as T;
}
