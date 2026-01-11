import { createPortal } from 'react-dom';
import './ModalEventView.css';

function ModalEventView({ isOpen, event, onClose, deleteEvent} : { isOpen: boolean; event: any; onClose: () => void; deleteEvent: () => void;}) { 
    if (!isOpen) return null;

    return createPortal(
        <div className="modalOverlay">
            <div className="modalContent">
                <button className="myButton modalCloseButton" onClick={onClose}>x</button>
                <h2>{event.title}</h2>
                <p>
                    Početak: {new Date(event.start).toLocaleString('hr-HR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </p>
                <p>
                    Kraj: {new Date(event.end).toLocaleString('hr-HR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </p>
                <button className="myButton modalDeleteButton" onClick={deleteEvent}>Izbriši</button>
            </div>
        </div>,
        document.body
    );
}

export default ModalEventView;
