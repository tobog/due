import { EventListener } from './dom'
export default class Clipboard {
    constructor (trigger, options) {
        this.events = {};
        this.resolveOptions(options);
        this.onClick = this.onClick.bind(this);
        this.listenClick(trigger);
    }
    resolveOptions(options = {}) {
        this.container = typeof options.container === "object" ? options.container : document.body;
        this.action = typeof options.action === "function" ? options.action : this.defaultAction
        this.target = typeof options.target === "function" ? options.target : this.defaultTarget
        this.text = typeof options.text === "function" ? options.text : this.defaultText;
        const events = ['copy', 'cut', 'paste', 'beforeCopy', 'beforeCut', 'beforePaste'];
        events.forEach((key) => {
            this.on(key, options[key])
        });

    }
    static isSupported(action = ["copy", "cut"]) {
        const actions = typeof action === "string" ? [action] : action
        let support = !!document.queryCommandSupported
        actions.forEach((action) => {
            support = support && !!document.queryCommandSupported(action)
        })
        return support
    }
    onClick(e) {
        const trigger = e.delegateTarget || e.currentTarget;
        console.log(e)
        const action = this.action(trigger) || 'copy';
        const text = this.text(trigger);
        const target = this.target(trigger, this.container);
        if (action === 'copy') {
            this.copy(text || target)
        } else if (action === 'cut') {
            this.cut(target)
        } else if (action === 'paste') {
            this.paste(target)
        }
    }
    copy(value) {
        let succeeded;
        this._emit('beforeCopy');
        if (value instanceof HTMLElement) {
            value = value.value || value.innerText;
        }
        if (document.execCommand) {
            const fakeEle = createFakeEle(value)
            this.container.appendChild(fakeEle)
            if (document.selection) {
                let range = document.body.createTextRange()
                range.moveToElementText(fakeEle)
                range.select()
            } else if (window.getSelection) {
                let range = document.createRange()
                range.selectNode(fakeEle)
                window.getSelection().removeAllRanges()
                window.getSelection().addRange(range)
            }
            try {
                succeeded = document.execCommand("copy")
            } catch (err) {
                succeeded = false
            }
            this.container.removeChild(fakeEle)
        } else if (window.clipboardData) {
            succeeded = window.clipboardData.setData("text", value)
        }
        this._emit(succeeded ? 'copy' : 'error', value);
        return succeeded;
    }
    cut(ele) {
        if (!ele) return;
        this._emit('beforeCut');
        let element = ele, isFakeEle = false, succeeded;
        if (element.type !== "text" && element.type !== "textarea") {
            element = createFakeEle(ele.value || ele.innerText);
            isFakeEle = true;
            this.container.appendChild(element);
        }
        let value = element.value;
        if (document.execCommand) {
            if (document.selection) {
                let range = document.body.createTextRange()
                range.moveToElementText(element)
                range.select()
            } else if (window.getSelection) {
                let range = document.createRange()
                range.selectNode(element)
                window.getSelection().removeAllRanges()
                window.getSelection().addRange(range)
            }
            try {
                succeeded = document.execCommand("cut");
                isFakeEle && (ele.innerHTML = '');
            } catch (err) {
                succeeded = false
            }
        } else if (window.clipboardData) {
            succeeded == window.clipboardData.setData("text", value)
            ele[isFakeEle ? 'innerHTML' : 'value'] = '';
        }
        isFakeEle && this.container.removeChild(element);
        this._emit(succeeded ? 'cut' : 'error', value);
        return succeeded;
    }
    paste(ele) {
        if (!ele) return;
        let succeeded;
        this._emit('beforePaste')
        if (document.execCommand) {
            let element = null;
            if (!ele.setSelectionRange && !ele.createTextRange) {
                element = createFakeEle('');;
                this.container.appendChild(element);
            }
            if (ele.setSelectionRange) {
                ele.focus()
                ele.setSelectionRange(ele.value.length, ele.value.length)
            } else if (ele.createTextRange) {
                let range = ele.createTextRange()
                range.collapse(true)
                range.moveEnd("character", ele.value.length)
                range.moveStart("character", ele.value.length)
                range.select()
            }
            try {
                succeeded = document.execCommand("paste")
            } catch (err) {
                succeeded = false
            }
            if (element && succeeded) {
                ele.innerText = element.value;
                this.container.removeChild(element);
            }

        } else if (window.clipboardData) {
            const value = window.clipboardData.getData("text")
            if (ele.type !== "text" && ele.type !== "textarea") {
                ele.innerText = value;
            } else {
                ele.value += value;
            }
            succeeded = true;
        }
        this._emit(succeeded ? 'paste' : 'error', ele.value || ele.innerText);
        return succeeded;
    }
    defaultAction(trigger) {
        return getAttributeValue("action", trigger)
    }
    defaultTarget(trigger, container) {
        const selector = getAttributeValue("target", trigger)
        if (selector) {
            return (container || document).querySelector(selector)
        }
    }
    defaultText(trigger) {
        return getAttributeValue("text", trigger)
    }
    on(eventName, fn) {
        if (typeof fn === 'function') {
            if (this.events[eventName]) {
                this.events[eventName].push(fn)

            } else {
                this.events[eventName] = [fn];
            }
        }
    }
    _emit(eventName, ...args) {
        const fns = this.events[eventName];
        if (fns) {
            for (let index = 0, len = fns.length; index < len; index++) {
                fns[index].call(this, ...args);
            }
        }
    }
    listenClick(trigger) {
        this.destroy();
        this._trigger = trigger;
        EventListener.on(this._trigger, 'click', this.onClick);
    }
    destroy() {
        if (!this._trigger) return
        EventListener.off(this._trigger, 'click', this.onClick);
        this._trigger = null;
    }
}



/**
 * Helper function to retrieve attribute value.
 * @param {String} value
 * @return {Element} element
 */
function createFakeEle(value) {
    const fakeEle = document.createElement("textarea")
    fakeEle.style.position = "absolute"
    fakeEle.style.zIndex = -99999
    fakeEle.style.opacity = 0
    fakeEle.style.height = 0
    fakeEle.style.width = 0
    fakeEle.style.overflow = "hidden"
    fakeEle.setAttribute("readonly", "")
    fakeEle.value = value;
    return fakeEle;
}

/**
 * Helper function to retrieve attribute value.
 * @param {String} suffix
 * @param {Element} element
 */
function getAttributeValue(suffix, element) {
    const attribute = `data-clipboard-${suffix}`

    if (!element.hasAttribute(attribute)) {
        return
    }

    return element.getAttribute(attribute)
}
