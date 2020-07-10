import * as React from 'react';
import * as ReactDOM from 'react-dom';
import warning from 'tiny-warning';
import { v4 as uuidv4 } from 'uuid';

import {
  ErrorBoundary,
  getBackendProps,
  logger,
  AcrossComponent,
} from './react-across.utils';

type LazyReactEl = React.LazyExoticComponent<AcrossComponent>;

const knownElements = new Map<string, LazyReactEl>();

// TODO iets voorzien voor loader override
const defaultLoader = <div>Loading...</div>;

export function registerComponent({
  identifier,
  Component,
}: {
  identifier: string;
  Component: LazyReactEl;
}) {
  if (knownElements.has(identifier))
    logger.warn(`There was already a registered item with key: ${identifier}`);

  knownElements.set(identifier, Component);
}

let forceRender = () => {};

export function triggerUpdate() {
  forceRender();
}

function getWidgets() {
  const widgets = document.querySelectorAll<HTMLDivElement>('[data-component]');
  widgets.forEach(el => {
    if (!el.dataset.acrossReactId) {
      el.dataset.acrossReactId = uuidv4();
    }
  });

  return Array.from(widgets);
}

const App: React.FC = () => {
  const [, setCounter] = React.useState(0);
  const triggerRender = React.useCallback(() => setCounter(i => i + 1), []);

  React.useEffect(() => {
    forceRender = triggerRender;
  }, [triggerRender]);

  const nodes = getWidgets();

  return (
    <React.Suspense fallback={defaultLoader}>
      {nodes.map(DOMNode => {
        const componentId = DOMNode.dataset.acrossReactId;

        warning(componentId, `Elements need an unique id!`);

        const componentName = DOMNode.getAttribute('data-component')!;
        const Component = knownElements.get(componentName);

        if (!Component) {
          warning(
            Component,
            `Tried to render unknown element with identifier: ${componentName}`
          );
          return null;
        }

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

export function render({
  container,
  Wrapper = DefaultWrapper,
  callback,
}: Renderer) {
  return ReactDOM.render(
    <Wrapper>
      <App />
    </Wrapper>,
    container,
    callback
  );
}
