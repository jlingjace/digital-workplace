import { Icon } from "@/components/ui/Icon";
import { Tool } from "@/lib/types";

interface Props {
  tool: Tool;
}

export function ToolCard({ tool }: Props) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 hover:border-primary hover:shadow-md transition-all duration-150 flex flex-col">
      {/* Top: icon/logo + name + status badge */}
      <div className="flex items-start gap-3 mb-3">
        {tool.logoUrl ? (
          <img
            src={tool.logoUrl}
            alt={tool.name}
            className="w-10 h-10 object-contain rounded-md flex-shrink-0"
          />
        ) : (
          <Icon name="dns" className="text-primary text-[32px] flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-[18px] font-semibold text-on-surface leading-snug">{tool.name}</h3>
          <span className="inline-block bg-tertiary/10 text-tertiary text-[11px] font-mono rounded-full px-2 py-0.5 mt-1">
            Open Access
          </span>
        </div>
      </div>

      {/* Description */}
      {tool.description && (
        <p className="text-[14px] text-on-surface-variant line-clamp-2 mb-3">
          {tool.description}
        </p>
      )}

      {/* Owner */}
      <p className="text-[12px] font-mono text-on-surface-variant mb-4">
        Owner: {tool.ownerName}
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-2 mt-auto">
        {tool.url ? (
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 bg-primary text-on-primary rounded-lg text-[13px] font-mono hover:bg-primary/90 transition-colors"
          >
            Go to Tool
          </a>
        ) : (
          <span className="flex-1 text-center py-2 bg-primary/40 text-on-primary rounded-lg text-[13px] font-mono cursor-not-allowed">
            Go to Tool
          </span>
        )}
        <button
          onClick={() => window.alert("Access request submitted!")}
          className="flex-1 py-2 border border-outline-variant text-on-surface rounded-lg text-[13px] font-mono hover:bg-surface-container transition-colors"
        >
          Request Access
        </button>
      </div>
    </div>
  );
}
