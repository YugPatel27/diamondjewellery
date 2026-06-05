import { X } from "@/components/Icons";

interface EducationModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string[];
}

const EducationModal = ({ open, onClose, title, content }: EducationModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-card border border-border w-[90%] max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-heading text-xl font-medium">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close education guide"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          {content.map((para, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationModal;
