import { isScroll, getClientSize } from './dom';
export default class Offset {
    constructor() {

    }
    static getClientSize(...args) {
        return getClientSize(...args)
    }
    static getRelativeOffsetRect(element, parent) {
        var elementRect = Offset.boundingClientRect(element);
        var parentRect = Offset.boundingClientRect(parent);
        var rect = {
            top: elementRect.top - parentRect.top,
            left: elementRect.left - parentRect.left,
            bottom: (elementRect.top - parentRect.top) + elementRect.height,
            right: (elementRect.left - parentRect.left) + elementRect.width,
            width: elementRect.width,
            height: elementRect.height
        };
        return rect;
    }
    static boundingClientRect(element) {
        if (!element) return {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
            offsetTop: 0,
            offsetLeft: 0,
        }
        let rect = element.getBoundingClientRect(),
            top = rect.top;
        if (element.tagName === "BODY") {
            top = Math.min(rect.top, document.documentElement.getBoundingClientRect().top)
        }
        // IE11以下//
        return {
            left: rect.left,
            top: top,
            right: rect.right,
            bottom: rect.bottom,
            width: element.offsetWidth,
            height: element.offsetHeight,
            offsetTop: element.offsetTop,
            offsetLeft: element.offsetLeft,
        };
    }
    static getOffset(node) {
        var nodeOffset = {
            width: node.offsetWidth,
            height: node.offsetHeight,
            left: node.offsetLeft,
            top: node.offsetTop
        };
        nodeOffset.right = nodeOffset.left + nodeOffset.width;
        nodeOffset.bottom = nodeOffset.top + nodeOffset.height;
        return nodeOffset;
    }
    static getOffsetRect(node, boundaryNode) {
        boundaryNode = boundaryNode || node.offsetParent;
        const scrollNodes = [window], rect = Offset.boundingClientRect(node),
            { top = 0, left = 0 } = Offset.getRelativeOffsetRect(node, boundaryNode);
        let parentNode = node.parentNode;
        while (parentNode && parentNode.tagName !== 'HTML') {
            if (isScroll(parentNode)) scrollNodes.push(parentNode);
            if (parentNode === boundaryNode) break;
            parentNode = parentNode.parentNode;
        }
        return { top: top + boundaryNode.scrollTop - boundaryNode.clientTop, left: left + boundaryNode.scrollLeft - boundaryNode.clientLeft, rect, scrollNodes }
    }
    // static getOffsetRect(node, boundaryNode) {
    //     let left = 0, top = 0, scrollNodes = [window], curNode = node, preNode = node;
    //     while (curNode && !(/html/i.test(curNode.tagName))) {
    //         const offsetParent = preNode.offsetParent||document.body, isScrollNode = isScroll(curNode);// preNode.offsetParent||document.body 针对fixed 定位无offsetParent
    //         if (isScrollNode) scrollNodes.push(curNode);
    //         if (curNode === offsetParent) {
    //             const rect = Offset.getRelativeOffsetRect(preNode, curNode),
    //                 sameNode = boundaryNode === curNode;
    //             top += rect.top;
    //             left += rect.left;
    //             if (isScrollNode && sameNode) {
    //                 left += curNode.scrollLeft
    //                 top += curNode.scrollTop
    //             }
    //             if (!boundaryNode || sameNode) break;
    //             preNode = curNode;
    //         }
    //         curNode = curNode.parentNode;
    //     }
    //     return { left, top, rect: Offset.boundingClientRect(node), scrollNodes }
    // }
    // static getOffseWrap(node, boundaryNode = null) {
    //     let left = 0, top = 0, scrollNodes = [window], curNode = node, preNode = node;
    //     while (node && curNode && !(/html/i.test(curNode.tagName))) {
    //         const offsetParent = preNode.offsetParent;
    //         if (isScroll(curNode)) {
    //             scrollNodes.push(curNode)
    //         }
    //         if (curNode === offsetParent) {
    //             left += preNode.offsetLeft + offsetParent.clientLeft;
    //             top += preNode.offsetTop + offsetParent.clientTop;
    //             preNode = curNode;
    //             if (!boundaryNode || boundaryNode === curNode) break;
    //         }
    //         curNode = curNode.parentNode;
    //     }
    //     return { left, top, rect: Offset.boundingClientRect(node), scrollNodes }
    // }

}





