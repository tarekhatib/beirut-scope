import type { ReactNode } from "react";

type Mark = {
  type: string;
  attrs?: Record<string, unknown>;
};

type Node = {
  type: string;
  text?: string;
  marks?: Mark[];
  attrs?: Record<string, unknown>;
  content?: Node[];
};

function applyMarks(children: ReactNode, marks: Mark[]): ReactNode {
  return marks.reduce((node, mark) => {
    switch (mark.type) {
      case "bold":      return <strong>{node}</strong>;
      case "italic":    return <em>{node}</em>;
      case "underline": return <u>{node}</u>;
      case "code":      return <code>{node}</code>;
      case "link":
        return (
          <a href={mark.attrs?.href as string} target={(mark.attrs?.target as string) ?? "_self"} rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-400">
            {node}
          </a>
        );
      default: return node;
    }
  }, children);
}

function renderNode(node: Node, i: number): ReactNode {
  const children = () => (node.content ?? []).map((n, j) => renderNode(n, j));

  switch (node.type) {
    case "doc":       return <>{children()}</>;
    case "paragraph": return <p key={i} dir="auto">{node.content?.length ? children() : <br />}</p>;
    case "hardBreak": return <br key={i} />;
    case "horizontalRule": return <hr key={i} />;

    case "heading": {
      const level = (node.attrs?.level as number) ?? 1;
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return <Tag key={i} dir="auto">{children()}</Tag>;
    }

    case "text": {
      const marks = node.marks ?? [];
      const text = node.text ?? "";
      return <span key={i}>{marks.length ? applyMarks(text, marks) : text}</span>;
    }

    case "blockquote":   return <blockquote key={i} dir="auto">{children()}</blockquote>;
    case "bulletList":   return <ul key={i} dir="auto">{children()}</ul>;
    case "orderedList":  return <ol key={i} dir="auto">{children()}</ol>;
    case "listItem":     return <li key={i} dir="auto">{children()}</li>;
    case "codeBlock":    return <pre key={i}><code>{children()}</code></pre>;

    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={node.attrs?.src as string} alt={(node.attrs?.alt as string) ?? ""} loading="lazy" className="rounded-lg max-w-full mx-auto my-4" />
      );

    case "iframe": {
      const src = node.attrs?.src as string;
      const isTwitter = src?.includes("platform.twitter.com");
      return isTwitter ? (
        <div key={i} className="my-4 flex justify-center">
          <iframe src={src} className="w-full max-w-lg rounded-lg border-0" style={{ height: "500px" }} />
        </div>
      ) : (
        <div key={i} className="relative w-full aspect-video my-4">
          <iframe src={src} className="w-full h-full rounded-lg border-0" allowFullScreen />
        </div>
      );
    }

    default: return null;
  }
}

type Props = { content: Node };

export default function ArticleContent({ content }: Props) {
  return (
    <div className="article-prose prose prose-neutral max-w-none prose-headings:text-ink prose-headings:font-bold prose-p:text-ink prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-ink prose-blockquote:border-l-accent prose-blockquote:text-ink-soft prose-hr:border-line prose-img:rounded-lg prose-img:mx-auto prose-code:text-ink prose-code:bg-line prose-code:px-1 prose-code:rounded">
      {renderNode(content, 0)}
    </div>
  );
}
