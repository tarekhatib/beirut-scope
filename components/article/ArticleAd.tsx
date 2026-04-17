import Image from "next/image";

interface Props {
  imageUrl: string;
  linkUrl: string;
  text?: string | null;
}

export default function ArticleAd({ imageUrl, linkUrl, text }: Props) {
  return (
    <div className="my-6">
      <p className="text-[10px] uppercase tracking-widest text-ink-muted mb-2 font-medium">Sponsored</p>
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block rounded-xl overflow-hidden border border-line hover:opacity-90 transition-opacity"
      >
        <Image
          src={imageUrl}
          alt="Advertisement"
          width={0}
          height={0}
          sizes="(max-width: 768px) 100vw, 768px"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        {text && (
          <div className="px-4 py-3 bg-surface border-t border-line">
            <p className="text-sm text-ink">{text}</p>
          </div>
        )}
      </a>
    </div>
  );
}
