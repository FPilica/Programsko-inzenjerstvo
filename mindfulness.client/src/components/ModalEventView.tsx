import { createPortal } from 'react-dom';
import './ModalEvent.css';

function ModalEventView({ isOpen, event, onClose, deleteEvent} : { isOpen: boolean; event: any; onClose: () => void; deleteEvent: () => void;}) { 
    if (!isOpen) return null;

    return createPortal(
        <div className="modalOverlay">
            <div className="modalContent">
                <button className="myButton modalCloseButton" onClick={onClose}>x</button>
                <h2><b>{event.title}</b></h2>
                <p>
                    Početak: <b>{new Date(event.start).toLocaleString('hr-HR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</b>
                </p>
                <p>
                    Kraj: <b>{new Date(event.end).toLocaleString('hr-HR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</b>
                </p>
                <p>
                    Opis: {event.description || event.extendedProps?.description || 'Nema opisa ovog događaja.'}
                </p>
                <button className="myButton modalDeleteButton" onClick={deleteEvent}>Izbriši</button>
            </div>
        </div>,
        document.body
    );
}

export default ModalEventView;
