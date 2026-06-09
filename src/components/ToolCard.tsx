import { ExternalLink, User, Mail, MessageSquare } from "lucide-react";
import { Tool } from "@/lib/types";
import { DepartmentBadge } from "./DepartmentBadge";

interface Props {
  tool: Tool;
}

export function ToolCard({ tool }: Props) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-card hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-start gap-3 mb-3">
        {tool.logoUrl ? (
          <img
            src={tool.logoUrl}
            alt={tool.name}
            className="w-12 h-12 object-contain rounded-md flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-md bg-primary/10 text-primary/80 font-bold text-xl flex items-center justify-center flex-shrink-0">
            {tool.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-neutral-900 text-sm">{tool.name}</h3>
            {tool.url && (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
                onClick={(e) => e.stopPropagation()}
                aria-label={`打开 ${tool.name}`}
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>
          <DepartmentBadge department={tool.department} className="mt-1" />
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-3 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-neutral-600">
          <User size={12} className="flex-shrink-0" />
          <span>{tool.ownerName}</span>
        </div>
        {tool.ownerSlack && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <MessageSquare size={12} className="flex-shrink-0" />
            <span>{tool.ownerSlack}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-neutral-600">
          <Mail size={12} className="flex-shrink-0" />
          <a href={`mailto:${tool.ownerEmail}`} className="hover:text-primary truncate">
            {tool.ownerEmail}
          </a>
        </div>
      </div>

      {tool.description && (
        <p className="mt-3 text-xs text-neutral-500 line-clamp-2">{tool.description}</p>
      )}
    </div>
  );
}
