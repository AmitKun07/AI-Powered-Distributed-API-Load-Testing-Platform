type SidebarPlaceholderProps = {
  title: string;
  description?: string;
};

function SidebarPlaceholder({ title, description }: SidebarPlaceholderProps) {
  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col border-r border-[#1e1e1e] bg-[#1c1c1c]">
      <div className="border-b border-[#1e1e1e] px-4 py-3">
        <h2 className="text-[13px] font-semibold text-zinc-200">{title}</h2>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <p className="text-[12px] text-zinc-500">
          {description ?? "This area is reserved for future workspace tools."}
        </p>
      </div>
    </div>
  );
}

export default SidebarPlaceholder;
