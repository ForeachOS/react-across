import * as React from "react";

type DidMount = ((ref: HTMLDivElement) => void) | null;

interface AcrossPartialProps {
  url: string;
  didMount?: DidMount;
}

export function useAcrossPartial(url: string, didMount: DidMount = null) {
  const [html, setHtml] = React.useState<string>();

  const ref = React.useRef<HTMLDivElement>(null);
  const didMountRef = React.useRef(didMount);

  const updatePartial = React.useCallback(() => {
    fetch(url)
      .then(response => response.text())
      .then(res => setHtml(res));
  }, [url]);

  React.useEffect(() => {
    didMountRef.current = didMount;
  }, [didMount]);

  React.useEffect(() => {
    ref.current && didMountRef.current?.(ref.current);
  }, [html]);

  React.useEffect(() => {
    updatePartial();
  }, [updatePartial]);

  return [html, ref, updatePartial] as const;
}

/**
 * Experimental Component to render partial info
 */
export function AcrossPartial({ url, didMount }: AcrossPartialProps) {
  const [html, ref] = useAcrossPartial(url, didMount);

  if (!html) return null;
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }}></div>;
}
