// // Helper for generating column width
// export function calcGridColWidth(props) {
//     const { margin, containerPadding, containerWidth, cols } = props
//     return (containerWidth - margin[0] * (cols - 1) - containerPadding[0] * 2) / cols
// }

// export function calcGridItemPosition(props = {}, size) {
//     const { margin, containerPadding, rowHeight } = props
//     const colWidth = calcGridColWidth(props)
//     const out = {}

//     // If resizing, use the exact width and height as returned from resizing callbacks.
//     if (state && state.resizing) {
//         out.width = Math.round(state.resizing.width)
//         out.height = Math.round(state.resizing.height)
//     }
//     // Otherwise, calculate from grid units.
//     else {
//         out.width = calcGridItemWHPx(w, colWidth, margin[0])
//         out.height = calcGridItemWHPx(h, rowHeight, margin[1])
//     }

//     // If dragging, use the exact width and height as returned from dragging callbacks.
//     if (state && state.dragging) {
//         out.top = Math.round(state.dragging.top)
//         out.left = Math.round(state.dragging.left)
//     }
//     // Otherwise, calculate from grid units.
//     else {
//         out.top = Math.round((rowHeight + margin[1]) * y + containerPadding[1])
//         out.left = Math.round((colWidth + margin[0]) * x + containerPadding[0])
//     }

//     return out
// }
