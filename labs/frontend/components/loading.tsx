export default function Loading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyanAccent"></div>
      <span className="ml-2 text-white/60">Processing...</span>
    </div>
  )
}
