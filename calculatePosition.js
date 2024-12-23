function calculatePosition(index, currentIndex, isMobile, padding, elementWidth) {
    if (currentIndex === null) return "0px";

    if (index === currentIndex) {
        return isMobile ? "12px" : `${padding * index}px`;
    } else if (index > currentIndex) {
        return isMobile ? `${12}px` : `${padding * index}px`;
    } else {
        return isMobile ? `${-elementWidth + 12}px` : `-${elementWidth - padding * (index + 1) - 1}px`;
    }
}