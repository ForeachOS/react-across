import * as React from "react";

export function useAcrossPartial<T extends HTMLElement = HTMLDivElement>(
  fetchHtmlFn: () => Promise<string>,
  onUpdate: ((ref: T) => void) | null = null
) {
  const [html, setHtml] = React.useState<string>();

  const ref = React.useRef<T>(null);
  const onUpdateRef = React.useRef(onUpdate);

  const updatePartial = React.useCallback(() => {
    fetchHtmlFn().then((res) => setHtml(res));
  }, [fetchHtmlFn]);

  React.useEffect(() => {
    // Keep latest onupdate fn in ref.
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  React.useEffect(() => {
    // trigger onUpdate when html changes
    ref.current && onUpdateRef.current?.(ref.current);
  }, [html]);

  React.useEffect(() => {
    // run fetchHtmlFn whenever reference of this fn changes.
    updatePartial();
  }, [updatePartial]);

  return [html, ref, updatePartial] as const;
}

/**
 * Experimental Component to render partial info
 */
interface AcrossPartialProps<T extends HTMLElement = HTMLDivElement> {
  fetchHtmlFn: () => Promise<string>;
  onUpdate?: ((ref: T) => void) | null;
}

export function AcrossPartial({ fetchHtmlFn, onUpdate }: AcrossPartialProps) {
  const [html, ref] = useAcrossPartial(fetchHtmlFn, onUpdate);

  if (!html) return null;
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }}></div>;
}
