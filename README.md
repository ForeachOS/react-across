# React Across


## API:
- `triggerUpdate`: Requery the page and initialize new widgets.
```ts
function triggerUpdate(): void;
```

- `render`: Alternative to `ReactDOM.render()`
Pass in a container element and optionally a Wrapper component (to be used for Redux Providers for example.)
```ts
interface Renderer {
    container: Element | null;
    Wrapper?: React.FC;
    callback?: () => void;
}
function render({ container, Wrapper, callback, }: Renderer): void;
```

- `registerComponent`: Used to register React components
```ts
type LazyReactEl = React.LazyExoticComponent<AcrossComponent>;
 function registerComponent({ identifier, Component, }: {
    identifier: string;
    Component: LazyReactEl;
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