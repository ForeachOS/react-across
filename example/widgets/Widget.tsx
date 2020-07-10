//eslint-disable-next-line
import * as React from "react";
import { AcrossComponent } from "../../src";

const Widget: AcrossComponent<{ test: string }> = props => {
  const [state, setState] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setState(i => i + 1), 1000);
    return () => {
      console.log("clearing...");
      window.clearInterval(id);
    };
  }, []);
  return (
    <div>
      Custom Widget that displays props: {JSON.stringify(props)} - {state}
    </div>
  );
};

export default Widget;
