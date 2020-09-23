import * as React from "react";
import * as ReactDOM from "react-dom";
import warning from "tiny-warning";
import { v4 as uuidv4 } from "uuid";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorFallback, getBackendProps, logger, AcrossComponent } from "./react-across.utils";

type LazyReactEl = React.LazyExoticComponent<AcrossComponent>;
type LoaderEl = React.SuspenseProps["fallback"];

interface RegisterAcrossElement {
  identifier: string;
  Component: LazyReactEl;
  Loader?: LoaderEl;
}

const knownElements = new Map<string, { Component: LazyReactEl; Loader: LoaderEl }>();

export function registerComponent({ identifier, Component, Loader = null }: RegisterAcrossElement) {
  if (knownElements.has(identifier)) logger.warn(`There was already a registered item with key: ${identifier}`);

  knownElements.set(identifier, { Component, Loader });
}

let forceRender = () => warning(true, `Called 'hydrate' when application has not been initialised yet!`);

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
    <React.Suspense fallback={null}>
      {nodes.map((DOMNode) => {
        const componentId = DOMNode.dataset.acrossReactId;

        warning(componentId, `Elements need an unique id!`);

        const componentName = DOMNode.getAttribute("data-component")!;
        const widget = knownElements.get(componentName);

        if (!widget) {
          warning(widget, `Tried to render unknown element with identifier: ${componentName}`);
          return null;
        }

        const { Component, Loader } = widget;

        const dataProps = getBackendProps(DOMNode);
        return ReactDOM.createPortal(
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <React.Suspense fallback={Loader}>
              <Component data={dataProps} />
            </React.Suspense>
          </ErrorBoundary>,
          DOMNode,
          componentId
        );
      })}
    </React.Suspense>
  );
};

interface Renderer {
  container: Element | null;
  Wrapper?: React.FC;
  callback?: () => void;
}

const DefaultWrapper: React.FC = ({ children }) => <>{children}</>;

export function render({ container, Wrapper = DefaultWrapper, callback }: Renderer) {
  return ReactDOM.render(
    <Wrapper>
      <App />
    </Wrapper>,
    container,
    callback
  );
}
