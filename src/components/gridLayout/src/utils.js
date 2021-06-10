

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
    cols: number
): Layout {
    // If this is static and not explicitly enabled as draggable,
    // no move is possible, so we can short-circuit this immediately.
    if (l.static && l.isDraggable !== true) return layout;

    // Short-circuit if nothing to do.
    if (l.y === y && l.x === x) return layout;

    console.log(
        `Moving element ${l.i} to [${String(x)},${String(y)}] from [${l.x},${l.y}]`
    );
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

    // There was a collision; abort
    if (preventCollision && collisions.length) {
        log(`Collision prevented on ${l.i}, reverting.`);
        l.x = oldX;
        l.y = oldY;
        l.moved = false;
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
