export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 right-6 bg-white/6 border border-white/6 p-3 rounded shadow">
      {message}
    </div>
  )
}
