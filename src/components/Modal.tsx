import * as React from "react";

export interface ModalProps { show: boolean }

export class Modal extends React.Component<ModalProps> {
    render() {
        if (!this.props.show) {
            return null;
        }

        return (
            <div className="modal-backdrop">
                <div className="modal-background">
                    {this.props.children}
                </div>
            </div>
        );
    }

}
