# React Across

## API:

- `hydrate`: Requery the page and initialize new widgets, will throw an error when this is called before the main react page has been initialised.

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
  errorBoundaryProps,
}: {
  identifier: string;
  Component: React.LazyExoticComponent<AcrossComponent> | AcrossComponent;
  errorBoundaryProps?: ErrorBoundaryProps // See: https://github.com/bvaughn/react-error-boundary
  Loader?: React.ReactNode;
}): void;
```
Components imported using `React.lazy` will be loaded on demand, regular imports will result in the component included in the main bundle.

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
<!-- Somewhere in the dom -->
<div id="root"></div>
<!-- Somewhere else on the page. -->
<div data-component="my-cool-widget" data-props-test="value to be passed to react"></div>
```

## Passing data to components:

### data-props

This method takes preference over `data-props-xxx` method, those properties will be ignored when `data-props` is present.

JSON stringified object:

```html
<div data-props="{"obj":"also works","bool":true,"num":1}"></div>
```

Will be injected into the component props as:
```ts
const props = {
  data: {
    obj: "also works",
    bool: true,
    num: 1,
  }
}
```

### data-props-xxx
Passs individial properties into the component

```html
<div data-props-img="test" data-props-num="2" data-props-bool="true"></div>
```

Will be injected into the component props as:
```ts
const props = {
  data: {
    img: "test",
    num: "2",
    bool: "true",
  }
}
```

**Please note**: all properties are converted to string values, and will need further parsing if this method is used!