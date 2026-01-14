import { PencilIcon } from "@phosphor-icons/react/dist/icons/Pencil";
import { useNavigate } from "react-router-dom";
import "./ContentCard.css";

interface ContentCardProps {
    content: any;
    onClick: () => void;
    allowEdit?: boolean;
}

function ContentCard({content, onClick, allowEdit} : ContentCardProps) {
    const navigate = useNavigate();

    return (
        <div className="contentCard" onClick={onClick}>
            {allowEdit &&
                <button className="editContentButton" onClick={(e) => { e.stopPropagation(); navigate(`/editcontent/${content.contentId}`); }}><PencilIcon size={20} /></button>
            }
            <div className="cardThumbnail">
                {(content.type === "video" || (content.type === "article" && content.posterLink)) &&
                    <img src={content.posterLink} alt={content.title} />
                }
            </div>
            <div className="cardContent">
                <h3 className="cardTitle">{content.title}</h3>
                {content.type === "video" && (
                    <p>{content.description}</p>
                )}
                <div className="cardFooter">
                    <span className="contentType">{content.type === "article" ? "članak" : content.type}</span>
                    {content.type === "video" && (
                        <span className="contentDuration">{content.duration} min</span>
                    )
                    }
                    <span className="contentCategory">{content.category}</span>
                </div>
            </div>
        </div>
    )
}

export default ContentCard;