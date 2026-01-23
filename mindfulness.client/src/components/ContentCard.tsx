import { PencilIcon } from "@phosphor-icons/react/dist/icons/Pencil";
import { useNavigate } from "react-router-dom";
import type {ContentItem} from "../types/ContentItem";
import "./ContentCard.css";
import { useEffect, useState } from "react";

interface ContentCardProps {
    content: ContentItem;
    onClick: () => void;
    allowEdit?: boolean;
}

function ContentCard({content, onClick, allowEdit} : ContentCardProps) {
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState<string>("");

    useEffect(() => {
        const getCategoryName = (categoryId: string) => {
            if (!categoryId) return;
            console.log("Fetching category name for ID:", content.categoryId);
            const categories = JSON.parse(sessionStorage.getItem("categories") || "[]");
            const category = categories.find((cat: any) => cat.id === categoryId);
            setCategoryName(category ? category.name : "");
            console.log("Category name set to:", category ? category.name : "");
        }
        
        getCategoryName(content.categoryId || "");
    }, [content.categoryId]);

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
                    {content.contentType === "video" && content.duration && (
                        <span className="contentDuration">{content.duration.split(':')[0].split('.')[0]} min</span>
                    )
                    }
                    <span className="contentCategory">{categoryName}</span>
                </div>
            </div>
        </div>
    )
}

export default ContentCard;