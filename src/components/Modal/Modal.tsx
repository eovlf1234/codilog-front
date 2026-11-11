import "./Modal.css";
import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({
  open,
  onClose,
  children,
}: Props) => {

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
        document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default Modal;