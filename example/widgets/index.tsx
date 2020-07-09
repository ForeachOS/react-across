import * as React from "react";
import { registerComponent } from "../../src";

const Widget = React.lazy(() => import("./Widget"));

registerComponent({ identifier: "my-cool-widget", Component: Widget });
