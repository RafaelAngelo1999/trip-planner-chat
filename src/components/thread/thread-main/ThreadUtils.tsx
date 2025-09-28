import { ReactNode, useEffect } from "react";
import { Button } from "../../ui/button";
import { ArrowDown } from "lucide-react";
import { useStickToBottomContext } from "use-stick-to-bottom";

interface StickyToBottomContentProps {
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
  onScrollContext?: (isAtBottom: boolean, scrollToBottom: () => void) => void;
}

export function StickyToBottomContent(props: StickyToBottomContentProps) {
  const context = useStickToBottomContext();
  const { isAtBottom, scrollToBottom } = context;
  const { onScrollContext } = props;

  // Expose scroll context to parent component
  useEffect(() => {
    onScrollContext?.(isAtBottom, scrollToBottom);
  }, [isAtBottom, scrollToBottom, onScrollContext]);

  return (
    <div
      ref={context.scrollRef}
      style={{ width: "100%", height: "100%" }}
      className={props.className}
    >
      <div
        ref={context.contentRef}
        className={props.contentClassName}
      >
        {props.content}
      </div>

      {props.footer}
    </div>
  );
}

interface ScrollToBottomProps {
  className?: string;
}

export function ScrollToBottom(props: ScrollToBottomProps) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) return null;
  return (
    <Button
      variant="outline"
      className={props.className}
      onClick={() => scrollToBottom()}
    >
      <ArrowDown className="h-4 w-4" />
      <span>Scroll to bottom</span>
    </Button>
  );
}
