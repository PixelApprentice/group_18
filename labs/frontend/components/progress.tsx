// This component has been replaced by the modern Radix UI Progress component
// in components/ui/progress.tsx. This file can be removed.
export default function Progress({ value }: { value: number }) {
  return (
    <div className="w-24 h-2 bg-primary/20 rounded overflow-hidden">
      <div style={{ width: `${value}%` }} className="h-full bg-primary transition-all" />
    </div>
  )
}
