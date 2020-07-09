import "./index.scss";
import { render } from "../src";

import "./widgets";

const rootEl = document.querySelector("#root");

render({ container: rootEl });
