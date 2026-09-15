import { Select as SelectPrimitive } from "@base-ui/react/select"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/shared/lib/utils"

export type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  value: string
  onValueChange: (value: string) => void
  options: readonly SelectOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
  id?: string
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Selecciona…",
  className,
  disabled,
  id,
}: SelectProps) {
  const items = Object.fromEntries(options.map((o) => [o.value, o.label]))

  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={(next) => {
        if (next == null) return
        onValueChange(String(next))
      }}
      items={items}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        id={id}
        className={cn(
          "group/select flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-teal-200 bg-white px-3 text-left text-sm text-slate-800 shadow-sm outline-none transition",
          "hover:border-teal-400 hover:bg-teal-50/40",
          "focus-visible:border-teal-500 focus-visible:ring-3 focus-visible:ring-teal-500/20",
          "data-[popup-open]:border-teal-500 data-[popup-open]:ring-3 data-[popup-open]:ring-teal-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <SelectPrimitive.Value
          placeholder={placeholder}
          className="truncate data-[placeholder]:text-slate-400"
        />
        <SelectPrimitive.Icon className="shrink-0 text-teal-700">
          <ChevronDown className="size-4 transition-transform duration-200 group-data-[popup-open]/select:rotate-180" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner className="z-50 outline-none" sideOffset={6}>
          <SelectPrimitive.Popup
            className={cn(
              "min-w-[var(--anchor-width)] origin-[var(--transform-origin)] overflow-hidden rounded-xl border border-teal-100 bg-white shadow-xl shadow-teal-900/10 outline-none",
              "animate-in fade-in-0 zoom-in-95 duration-150",
            )}
          >
            <SelectPrimitive.List className="max-h-60 overflow-y-auto p-1.5 scroll-py-1.5">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none select-none",
                    "data-[highlighted]:bg-teal-50 data-[highlighted]:text-teal-900",
                    "data-[selected]:bg-teal-100/80 data-[selected]:font-semibold data-[selected]:text-teal-900",
                  )}
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check className="size-4 text-teal-700" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
