import * as React from "react";

export type AcrossComponent<T extends {} = any> = React.FC<{ data: T }>;

export class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(error);
    console.error(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <p style={{ margin: "0 auto" }}>Something went wrong.</p>;
    }

    return this.props.children;
  }
}

function prefixMessage(msg: string) {
  return `REACT-ACROSS: ${msg}`;
}

export const logger = {
  log: (msg: string) => console.log(prefixMessage(msg)),
  warn: (msg: string) => console.warn(prefixMessage(msg)),
  error: (msg: string) => console.error(prefixMessage(msg))
};

export function getBackendProps<T extends {}>(el: Element): Partial<T> {
  if (el === null) return {};

  const dataProps = el.getAttribute("data-props");
  return dataProps ? JSON.parse(dataProps) : {};
}
