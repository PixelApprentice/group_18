export default function Progress({ value }: { value: number }) {
  return (
    <div className="w-24 h-2 bg-white/6 rounded overflow-hidden">
      <div style={{ width: `${value}%` }} className="h-full bg-cyanAccent" />
    </div>
  )
}
