interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative card max-w-2xl w-full z-10 mx-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
