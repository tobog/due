import { EventListener } from './dom'
export default class Clipboard {
    constructor (trigger, options) {
        this.events = {};
        this.resolveOptions(options);
        this.onClick = this.onClick.bind(this);
        this.listenClick(trigger);
    }
    resolveOptions(options) {
        options = options || {};
        this.container = typeof options.container === "object" ? options.container : document.body;
        this.action = typeof options.action === "function" ? options.action : Clipboard.defaultAction
        this.target = typeof options.target === "function" ? options.target : Clipboard.defaultTarget
        this.text = typeof options.text === "function" ? options.text : Clipboard.defaultText;
        this.events = {};
        const events = ['copy', 'cut', 'paste', 'beforeCopy', 'beforeCut', 'beforePaste', 'success'];
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
    static defaultAction(trigger) {
        return getAttributeValue("action", trigger)
    }
    static defaultTarget(trigger, container) {
        const selector = getAttributeValue("target", trigger)
        if (selector) {
            return container.querySelector(selector) || document.querySelector(selector)
        }
    }
    static defaultText(trigger) {
        return getAttributeValue("text", trigger)
    }
    onClick(e) {
        const trigger = e.delegateTarget || e.currentTarget;
        const action = this.action(trigger) || 'copy';
        const target = this.target(trigger, this.container);
        if (action === 'copy') {
            this.copy(this.text(trigger) || target);
            return;
        }
        if (action === 'cut') {
            this.cut(target)
            return;
        }
        if (action === 'paste') {
            this.paste(target)
        }
    }
    copy(value) {
        let succeeded;
        this.$emit('beforeCopy');
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
        this.$emit(succeeded ? 'copy' : 'error', value);
        if (succeeded) this.$emit('success', value, 'copy');
        return succeeded;
    }
    cut(ele) {
        if (!ele) return;
        this.$emit('beforeCut');
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
        this.$emit(succeeded ? 'cut' : 'error', value);
        if (succeeded) this.$emit('success', value, 'cut');
        return succeeded;
    }
    paste(ele) {
        if (!ele) return;
        let succeeded, value;
        this.$emit('beforePaste')
        if (document.execCommand) {
            let element = ele;
            if (!ele.setSelectionRange && !ele.createTextRange) {
                element = createFakeEle('');
                this.container.appendChild(element);
            }
            value = element.value || "";
            if (element.setSelectionRange) {
                element.focus()
                element.setSelectionRange(value.length, value.length)
            } else if (element.createTextRange) {
                let range = element.createTextRange()
                range.collapse(true)
                range.moveEnd("character", value.length)
                range.moveStart("character", value.length)
                range.select()
            }
            try {
                succeeded = document.execCommand("paste")
            } catch (err) {
                succeeded = false
            }
            if (element !== ele && succeeded) {
                ele.innerText = value = element.value;
                this.container.removeChild(element);
            }
            if (element === ele && succeeded) {
                value = ele.value.slice(value.length)
            }

        } else if (window.clipboardData) {
            value = window.clipboardData.getData("text")
            if (ele.type !== "text" && ele.type !== "textarea") {
                ele.innerText = value;
            } else {
                ele.value += value;
            }
            succeeded = true;
        }
        this.$emit(succeeded ? 'paste' : 'error', value);
        if (succeeded) this.$emit('success', value, 'paste');
        return succeeded;
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
    $emit(eventName, ...args) {
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
        this._trigger instanceof HTMLElement && EventListener.on(this._trigger, 'click', this.onClick);
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
    fakeEle.readonly = ""
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
