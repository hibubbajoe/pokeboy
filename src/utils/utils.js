export const withGrid = (n) => {
    return n * 16;
}

export const asGridCoord = (x, y) => {
    return `${x * 16},${y * 16}`
}

export const nextPosition = (initX, initY, direction) => {
    let x = initX;
    let y = initY;
    const size = 16;
    if (direction === "left") {
        x -= size;
    } else if (direction === "right") {
        x += size;
    } else if (direction === "up") {
        y -= size;
    } else if (direction === "down") {
        y += size;
    }
    return { x, y };
}

export const oppositeDirection = (direction) => {
    if (direction === "left") { return "right" }
    if (direction === "right") { return "left" }
    if (direction === "up") { return "down" }
    return "up"
}

export const emitEvent = (name, detail) => {
    const event = new CustomEvent(name, {
        detail
    });
    document.dispatchEvent(event);
}