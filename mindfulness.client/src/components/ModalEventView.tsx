import { createPortal } from 'react-dom';
import { useState } from 'react';
import ContentViewModal from './ContentViewModal';
import './ModalEvent.css';

function ModalEventView({ isOpen, event, onClose, deleteEvent} : { isOpen: boolean; event: any; onClose: () => void; deleteEvent: () => void;}) { 
    const [showContentModal, setShowContentModal] = useState(false);

    const userRole = localStorage.getItem("userRole");
    
    if (!isOpen) return null;

    const contentItems = JSON.parse(localStorage.getItem("contentItems") || "[]");
    const eventContent = contentItems.find((item : any) => item.contentId === event.extendedProps?.contentId) || null;

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
                    {eventContent && (
                        <p>
                            <span>Sadržaj:</span>
                            <b 
                                className="clickableContentTitle"
                                onClick={() => setShowContentModal(true)}
                            >
                                {eventContent.title}
                            </b>
                        </p>
                    )}
                </div>
                
                <button className="myButton modalDeleteButton" onClick={deleteEvent}>Izbriši događaj</button>
            </div>
            {eventContent && (
                <ContentViewModal
                    content={eventContent}
                    isOpen={showContentModal}
                    onClose={() => setShowContentModal(false)}
                    allowEdit={userRole === 'admin'}
                />
            )}
        </div>,
        document.body
    );
}

export default ModalEventView;
