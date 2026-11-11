import {useRef} from "react";

export const useDragScroll = () => {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;

        isDown.current = true;
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;
    };

    const onMouseLeave = () => {
        isDown.current = false;
    };

    const onMouseUp = () => {
        isDown.current = false;
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if(!isDown.current || !scrollRef.current) return;

        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
    };

    return {
        scrollRef,
        dragEvents: {
            onMouseDown,
            onMouseLeave,
            onMouseUp,
            onMouseMove,
        },
    };
};