import * as React from "react";

export interface ModalProps {
    show: boolean;
    children: React.ReactNode;
}

export function Modal({ show, children }: ModalProps) {
    if (!show) {
        return <></>;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-background">{children}</div>
        </div>
    );
}
