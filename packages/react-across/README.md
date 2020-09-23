# React Across

## API:

- `hydrate`: Requery the page and initialize new widgets.

```ts
function hydrate(): void;
```

- `render`: Alternative to `ReactDOM.render()`
  Pass in a container element and optionally a Wrapper component (to be used for Redux Providers for example.)

```ts
interface Renderer {
  container: Element | null;
  Wrapper?: React.FC;
  callback?: () => void;
}
function render({ container, Wrapper, callback }: Renderer): void;
```

- `registerComponent`: Used to register React components, can optionally pass in a loader element that will be displayed when the element is fetched.

```ts
type LazyReactEl = React.LazyExoticComponent<AcrossComponent>;
function registerComponent({
  identifier,
  Component,
  Loader,
}: {
  identifier: string;
  Component: LazyReactEl;
  Loader?: React.ReactNode;
}): void;
```

## Usage

Register components:

```tsx
import { registerComponent } from "@foreachbe/react-across";
const Widget = React.lazy(() => import("./Widget"));
registerComponent({ identifier: "my-cool-widget", Component: Widget });
```

Render out the main entrypoint after importing the desired widgets:

```tsx
import { render } from "@foreachbe/react-across";
import "./widgets";

const rootEl = document.querySelector("#root");

render({ container: rootEl });
```

Add HTML with the following markup to get hydrated with react widgets:

```html
<div data-component="my-cool-widget"></div>
```
