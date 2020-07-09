import * as React from "react";
import * as ReactDOM from "react-dom";
import { ErrorBoundary, getBackendProps, logger, AcrossComponent } from "./react-across.utils";

type LazyReactEl = React.LazyExoticComponent<AcrossComponent>;

const knownElements = new Map<string, LazyReactEl>();

// TODO iets voorzien voor loader override
const defaultLoader = <div>Loading...</div>;

export function registerComponent({ identifier, Component }: { identifier: string; Component: LazyReactEl }) {
  if (knownElements.has(identifier)) logger.warn(`There was already a registered item with key: ${identifier}`);

  knownElements.set(identifier, Component);
}

const App: React.FC = () => {
  const [_, setCounter] = React.useState(0);
  const forceRender = React.useCallback(() => setCounter(i => i + 1), []);

  React.useEffect(() => {
    //@ts-ignore
    window.forceRender = forceRender;
  }, [forceRender]);

  const nodes = Array.from(document.querySelectorAll("[data-component]"));

  return (
    <React.Suspense fallback={defaultLoader}>
      {nodes.map(DOMNode => {
        const componentId = DOMNode.getAttribute("data-id");
        if (!componentId) return logger.error(`Elements need an unique id!`);

        const componentName = DOMNode.getAttribute("data-component")!;
        const Component = knownElements.get(componentName);

        if (!Component) return logger.error(`Tried to render unknown element with identifier: ${componentName}`);

        const dataProps = getBackendProps(DOMNode);
        return ReactDOM.createPortal(
          <ErrorBoundary>
            <React.Suspense fallback={defaultLoader}>
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
