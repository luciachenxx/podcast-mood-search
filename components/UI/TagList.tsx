import React from 'react';
import { Tag } from 'lucide-react';
import { TAG_COLORS } from '../../constants/tagColors';

interface TagListProps {
    tags: string[];
    className?: string;
    onTagClick?: (tag: string) => void;
}

const TagList: React.FC<TagListProps> = ({ tags, className = '', onTagClick }) => {
    const getTagStyle = (tag: string) =>
        TAG_COLORS[tag as keyof typeof TAG_COLORS] || TAG_COLORS.default;

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {tags.map((tag, index) => {
                const style = getTagStyle(tag);
                const isClickable = !!onTagClick;

                const TagComponent = isClickable ? 'button' : 'span';

                return (
                    <TagComponent
                        key={index}
                        onClick={isClickable ? () => onTagClick(tag) : undefined}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                            isClickable ? 'cursor-pointer hover:scale-105' : ''
                        }`}
                        style={{
                            backgroundColor: style.bg,
                            color: style.text,
                            borderColor: style.border,
                        }}
                    >
                        <Tag className="h-3 w-3" />
                        {tag}
                    </TagComponent>
                );
            })}
        </div>
    );
};

export default TagList;
