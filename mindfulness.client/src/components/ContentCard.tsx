import "./ContentCard.css";

interface ContentCardProps {
    content: any;
    onClick: () => void;
}

function ContentCard({content, onClick} : ContentCardProps) {
    return (
        <div className="contentCard" onClick={onClick}>
            <div className="cardThumbnail">
                {content.type === "video" &&
                    <img src={content.posterLink} alt={content.title} />
                }
            </div>
            <div className="cardContent">
                <h3 className="cardTitle">{content.title}</h3>
                <p>{content.description}</p>
                <div className="cardFooter">
                    <span className="contentType">{content.type}</span>
                    <span className="contentCategory">{content.category}</span>
                </div>
            </div>
        </div>
    )
}

export default ContentCard;