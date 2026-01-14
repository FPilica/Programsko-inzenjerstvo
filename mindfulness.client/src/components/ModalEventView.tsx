import { createPortal } from 'react-dom';
import './ModalEvent.css';

function ModalEventView({ isOpen, event, onClose, deleteEvent} : { isOpen: boolean; event: any; onClose: () => void; deleteEvent: () => void;}) { 
    if (!isOpen) return null;

    return createPortal(
        <div className="modalOverlay">
            <div className="modalContent">
                <button className="myButton modalCloseButton" onClick={onClose}>✕</button>
                <h2>{event.title}</h2>
                
                <div className="eventDetails">
                    <p>
                        <span>Početak:</span>
                        <b>{new Date(event.start).toLocaleString('hr-HR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</b>
                    </p>
                    <p>
                        <span>Kraj:</span>
                        <b>{new Date(event.end).toLocaleString('hr-HR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</b>
                    </p>
                    <p>
                        <span>Opis:</span>
                        <span>{event.description || event.extendedProps?.description || 'Nema opisa ovog događaja.'}</span>
                    </p>
                </div>
                
                <button className="myButton modalDeleteButton" onClick={deleteEvent}>Izbriši događaj</button>
            </div>
        </div>,
        document.body
    );
}

export default ModalEventView;
