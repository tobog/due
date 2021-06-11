

/**
 * Get a layout item by ID. Used so we can override later on if necessary.
 *
 * @param  {Array}  layout Layout array.
 * @param  {String} id     ID
 * @return {LayoutItem}    Item at ID.
 */
export function getLayoutItem(layout: Layout, id: string): ?LayoutItem {
    for (let i = 0, len = layout.length; i < len; i++) {
        if (layout[i].i === id) return layout[i];
    }
}

/**
 * Get all static elements.
 * @param  {Array} layout Array of layout objects.
 * @return {Array}        Array of static layout items..
 */
export function getStatics(layout: Layout): Array<LayoutItem> {
    return layout.filter(l => l.static);
}
/**
 * Helper to convert a number to a percentage string.
 *
 * @param  {Number} num Any number
 * @return {String}     That number as a percentage.
 */
export function perc(num: number): string {
    return num * 100 + "%";
}

export function setTransform({ top, left, width, height }: Position): Object {
    // Replace unitless items with px
    const translate = `translate(${left}px,${top}px)`;
    return {
        transform: translate,
        WebkitTransform: translate,
        MozTransform: translate,
        msTransform: translate,
        OTransform: translate,
        width: `${width}px`,
        height: `${height}px`,
        position: "absolute"
    };
}

export function setTopLeft({ top, left, width, height }: Position): Object {
    return {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        position: "absolute"
    };
}
// Legacy support for verticalCompact: false
export function compactType(
    props: ?{ verticalCompact: boolean, compactType: CompactType }
): CompactType {
    const { verticalCompact, compactType } = props || {};
    return verticalCompact === false ? null : compactType;
}
/**
 * Get layout items sorted from top left to right and down.
 *
 * @return {Array} Array of layout objects.
 * @return {Array}        Layout, sorted static items first.
 */
export function sortLayoutItems(
    layout: Layout,
    compactType: CompactType
): Layout {
    if (compactType === "horizontal") return sortLayoutItemsByColRow(layout);
    return sortLayoutItemsByRowCol(layout);
}

/**
 * Sort layout items by column ascending then row ascending.
 *
 * Does not modify Layout.
 */
export function sortLayoutItemsByColRow(layout: Layout): Layout {
    return layout.slice(0).sort(function (a, b) {
        if (a.x > b.x || (a.x === b.x && a.y > b.y)) {
            return 1;
        }
        return -1;
    });
}
/**
 * Sort layout items by row ascending and column ascending.
 *
 * Does not modify Layout.
 */
export function sortLayoutItemsByRowCol(layout: Layout): Layout {
    // Slice to clone array as sort modifies
    return layout.slice(0).sort(function (a, b) {
        if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
            return 1;
        } else if (a.y === b.y && a.x === b.x) {
            // Without this, we can get different sort results in IE vs. Chrome/FF
            return 0;
        }
        return -1;
    });
}

/**
 * Move an element. Responsible for doing cascading movements of other elements.
 *
 * Modifies layout items.
 *
 * @param  {Array}      layout            Full layout to modify.
 * @param  {LayoutItem} l                 element to move.
 * @param  {Number}     [x]               X position in grid units.
 * @param  {Number}     [y]               Y position in grid units.
 */
export function moveElement(
    layout: Layout,
    l: LayoutItem,
    x: ?number,
    y: ?number,
    isUserAction: ?boolean,
    preventCollision: ?boolean,
    compactType: CompactType,
    cols: number,
    allowOverlap: ?boolean
): Layout {
    // If this is static and not explicitly enabled as draggable,
    // no move is possible, so we can short-circuit this immediately.
    if (l.static && l.isDraggable !== true) return layout;

    // Short-circuit if nothing to do.
    if (l.y === y && l.x === x) return layout;
    const oldX = l.x;
    const oldY = l.y;

    // This is quite a bit faster than extending the object
    if (typeof x === "number") l.x = x;
    if (typeof y === "number") l.y = y;
    l.moved = true;

    // If this collides with anything, move it.
    // When doing this comparison, we have to sort the items we compare with
    // to ensure, in the case of multiple collisions, that we're getting the
    // nearest collision.
    // compactType="horizontal"
    let sorted = sortLayoutItems(layout, compactType);
    const movingUp =
        compactType === "vertical" && typeof y === "number"
            ? oldY >= y
            : compactType === "horizontal" && typeof x === "number"
                ? oldX >= x
                : false;

    // $FlowIgnore acceptable modification of read-only array as it was recently cloned
    if (movingUp) sorted = sorted.reverse();

    const collisions = getAllCollisions(sorted, l);
    console.log(collisions)
    // There was a collision; abort
    if (preventCollision && collisions.length) {
        if (!allowOverlap) {
            log(`Collision prevented on ${l.i}, reverting.`);
            l.x = oldX;
            l.y = oldY;
            l.moved = false;
        }
        return layout;
    }

    // Move each item that collides away from this element.
    for (let i = 0, len = collisions.length; i < len; i++) {
        const collision = collisions[i];
        log(
            `Resolving collision between ${l.i} at [${l.x},${l.y}] and ${collision.i} at [${collision.x},${collision.y}]`
        );

        // Short circuit so we can't infinite loop
        if (collision.moved) continue;

        // Don't move static items - we have to move *this* element away
        if (collision.static) {
            layout = moveElementAwayFromCollision(
                layout,
                collision,
                l,
                isUserAction,
                compactType,
                cols
            );
        } else {
            layout = moveElementAwayFromCollision(
                layout,
                l,
                collision,
                isUserAction,
                compactType,
                cols
            );
        }
    }

    return layout;
}


export function getAllCollisions(
    layout: Layout,
    layoutItem: LayoutItem
): Array<LayoutItem> {
    return layout.filter(l => collides(l, layoutItem));
}

/**
* Given two layoutitems, check if they collide.
*/
export function collides(l1: LayoutItem, l2: LayoutItem): boolean {
    if (l1.i === l2.i) return false; // same element
    if (l1.x + l1.w <= l2.x) return false; // l1 is left of l2
    if (l1.x >= l2.x + l2.w) return false; // l1 is right of l2
    if (l1.y + l1.h <= l2.y) return false; // l1 is above l2
    if (l1.y >= l2.y + l2.h) return false; // l1 is below l2
    return true; // boxes overlap
}

/**
 * This is where the magic needs to happen - given a collision, move an element away from the collision.
 * We attempt to move it up if there's room, otherwise it goes below.
 *
 * @param  {Array} layout            Full layout to modify.
 * @param  {LayoutItem} collidesWith Layout item we're colliding with.
 * @param  {LayoutItem} itemToMove   Layout item we're moving.
 */
export function moveElementAwayFromCollision(
    layout: Layout,
    collidesWith: LayoutItem,
    itemToMove: LayoutItem,
    isUserAction: ?boolean,
    compactType: CompactType,
    cols: number
): Layout {
    const compactH = compactType === "horizontal";
    // Compact vertically if not set to horizontal
    const compactV = compactType !== "horizontal";
    const preventCollision = collidesWith.static; // we're already colliding (not for static items)

    // If there is enough space above the collision to put this element, move it there.
    // We only do this on the main collision as this can get funky in cascades and cause
    // unwanted swapping behavior.
    if (isUserAction) {
        // Reset isUserAction flag because we're not in the main collision anymore.
        isUserAction = false;

        // Make a mock item so we don't modify the item here, only modify in moveElement.
        const fakeItem: LayoutItem = {
            x: compactH ? Math.max(collidesWith.x - itemToMove.w, 0) : itemToMove.x,
            y: compactV ? Math.max(collidesWith.y - itemToMove.h, 0) : itemToMove.y,
            w: itemToMove.w,
            h: itemToMove.h,
            i: "-1"
        };

        // No collision? If so, we can go up there; otherwise, we'll end up moving down as normal
        if (!getFirstCollision(layout, fakeItem)) {
            log(
                `Doing reverse collision on ${itemToMove.i} up to [${fakeItem.x},${fakeItem.y}].`
            );
            return moveElement(
                layout,
                itemToMove,
                compactH ? fakeItem.x : undefined,
                compactV ? fakeItem.y : undefined,
                isUserAction,
                preventCollision,
                compactType,
                cols
            );
        }
    }

    return moveElement(
        layout,
        itemToMove,
        compactH ? itemToMove.x + 1 : undefined,
        compactV ? itemToMove.y + 1 : undefined,
        isUserAction,
        preventCollision,
        compactType,
        cols
    );
}

/**
 * Given a layout, compact it. This involves going down each y coordinate and removing gaps
 * between items.
 *
 * Does not modify layout items (clones). Creates a new layout array.
 *
 * @param  {Array} layout Layout.
 * @param  {Boolean} verticalCompact Whether or not to compact the layout
 *   vertically.
 * @return {Array}       Compacted Layout.
 */
export function compact(
    layout: Layout,
    compactType: CompactType,
    cols: number
): Layout {
    // Statics go in the compareWith array right away so items flow around them.
    const compareWith = getStatics(layout);
    // We go through the items by row and column.
    const sorted = sortLayoutItems(layout, compactType);
    // Holding for new items.
    const out = Array(layout.length);

    for (let i = 0, len = sorted.length; i < len; i++) {
        let l = cloneLayoutItem(sorted[i]);

        // Don't move static elements
        if (!l.static) {
            l = compactItem(compareWith, l, compactType, cols, sorted);

            // Add to comparison array. We only collide with items before this one.
            // Statics are already in this array.
            compareWith.push(l);
        }

        // Add to output array to make sure they still come out in the right order.
        out[layout.indexOf(sorted[i])] = l;

        // Clear moved flag, if it exists.
        l.moved = false;
    }

    return out;
}
