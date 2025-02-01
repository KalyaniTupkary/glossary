export function calculatePosition(index, currentIndex, isMobile, padding, elementWidth) {
    if (currentIndex === null) return "0px";

    if (index === currentIndex) {
        return isMobile ? "24px" : `${padding * index}px`;
    } else if (index > currentIndex) {
        return isMobile ? `${48}px` : `${padding * index}px`;
    } else if (index === currentIndex - 1) {
        return isMobile ? `${-elementWidth + 24 + 2}px` : `-${elementWidth - padding * (index + 1) - 2}px`;
    } else {
        return isMobile ? `${-elementWidth}px` : `-${elementWidth - padding * (index + 1) - 2}px`;
    }
}

