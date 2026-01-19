import { PencilIcon } from "@phosphor-icons/react/dist/icons/Pencil";
import { useNavigate } from "react-router-dom";
import type {ContentItem} from "../types/ContentItem";
import "./ContentCard.css";

interface ContentCardProps {
    content: ContentItem;
    onClick: () => void;
    allowEdit?: boolean;
}

function ContentCard({content, onClick, allowEdit} : ContentCardProps) {
    const navigate = useNavigate();

    return (
        <div className="contentCard" onClick={onClick}>
            {allowEdit &&
                <button className="editContentButton" onClick={(e) => { e.stopPropagation(); navigate(`/editcontent/${content.id}`); }}><PencilIcon size={20} /></button>
            }
            <div className="cardThumbnail">
                {(content.contentType === "video" || (content.contentType === "article" && content.thumbnailLink)) &&
                    <img src={content.thumbnailLink} alt={content.title} />
                }
            </div>
            <div className="cardContent">
                <h3 className="cardTitle">{content.title}</h3>
                {content.contentType === "video" && (
                    <p>{content.description}</p>
                )}
                <div className="cardFooter">
                    <span className="contentType">{content.contentType === "article" ? "članak" : content.contentType}</span>
                    {content.contentType === "video" && (
                        <span className="contentDuration">{content.duration} min</span>
                    )
                    }
                    <span className="contentCategory">{content.contentCategory}</span>
                </div>
            </div>
        </div>
    )
}

export default ContentCard;