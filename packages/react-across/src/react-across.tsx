import * as React from "react";
import * as ReactDOM from "react-dom";

import warning from "tiny-warning";
import invariant from "tiny-invariant";
import { v4 as uuidv4 } from "uuid";
import { ErrorBoundary, ErrorBoundaryProps } from "react-error-boundary";

import { defaultErrorBoundaryProps, getBackendProps, AcrossComponent } from "./react-across.utils";

interface RegisterAcrossElement {
  identifier: string;
  Component: React.LazyExoticComponent<AcrossComponent> | AcrossComponent;
  errorBoundaryProps?: ErrorBoundaryProps;
  Loader?: React.SuspenseProps["fallback"];
}

const knownElements = new Map<string, Omit<RegisterAcrossElement, "identifier">>();

export function registerComponent({ identifier, ...data }: RegisterAcrossElement) {
  warning(!knownElements.has(identifier), `REACT-ACROSS: There was already a registered item with key: ${identifier}`);
  knownElements.set(identifier, data);
}

let forceRender = () => invariant(false, `Called 'hydrate' when application has not been initialised yet!`);

export function hydrate() {
  forceRender();
}

function getWidgets() {
  const widgets = document.querySelectorAll<HTMLDivElement>("[data-component]");
  widgets.forEach((el) => {
    if (!el.dataset.acrossReactId) {
      el.dataset.acrossReactId = uuidv4();
    }
  });

  return Array.from(widgets);
}

const App: React.FC = () => {
  const [, setCounter] = React.useState(0);
  const triggerRender = React.useCallback(() => setCounter((i) => i + 1), []);

  React.useEffect(() => {
    forceRender = triggerRender;
  }, [triggerRender]);

  const nodes = getWidgets();

  return (
    <>
      {nodes.map((DOMNode) => {
        const componentId = DOMNode.dataset.acrossReactId;
        warning(componentId, `React-Across: Elements need an unique id!`);

        const componentName = DOMNode.getAttribute("data-component")!;
        const widget = knownElements.get(componentName);

        if (!widget) {
          warning(widget, `React-Across: Tried to render unknown element with identifier: ${componentName}`);
          return null;
        }

        const dataProps = getBackendProps(DOMNode);
        const { Component, Loader = null, errorBoundaryProps = defaultErrorBoundaryProps } = widget;

        return ReactDOM.createPortal(
          <ErrorBoundary {...errorBoundaryProps}>
            <React.Suspense fallback={Loader}>
              <Component data={dataProps} />
            </React.Suspense>
          </ErrorBoundary>,
          DOMNode,
          componentId
        );
      })}
    </>
  );
};

interface Renderer {
  container: Element | null;
  Wrapper?: React.FC;
  callback?: () => void;
}

const DefaultWrapper: React.FC = ({ children }) => <>{children}</>;

export function render({ container, Wrapper = DefaultWrapper, callback }: Renderer) {
  invariant(container, `React-Across: Passed invalid container element to render, nothing will happen.`);

  return ReactDOM.render(
    <Wrapper>
      <App />
    </Wrapper>,
    container,
    callback
  );
}
