/**
 *
 *
 * @class clipBoard
 */
class clipBoard1 {
    constructor(element, options) {
        this.options = options || {}
        this.ele = element
        if (this.options.copy) {
            this.copyd()
        }
        if (this.options.cut) {
            this.cut()
        }
        if (this.options.paste) {
            this.paste()
        }
    }
    async copyd(value) {
        if (typeof this.options.beforeCopy === "function") {
            await this.options.beforeCopy()
        }
        value = value || this.ele.value || this.ele.innerText
        if (this.options.copy) {
            value = await this.options.copy()
        }
        // for modern browsers
        if (document.execCommand) {
            let element = document.createElement("SPAN")
            element.textContent = value
            element.style.position = "absolute"
            element.style.zIndex = -100
            element.style.opacity = -0
            document.body.appendChild(element)
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
            document.execCommand("copy")
            document.body.removeChild(element)
        }
        // for ie
        if (window.clipboardData) {
            window.clipboardData.setData("text", value)
        }
        // after copy
        if (typeof this.options.afterCopy) {
            await this.options.afterCopy()
        }
    }
    async cut() {
        if (this.ele.type !== "text" && this.ele.type !== "textarea") {
            return
        }
        if (typeof this.options.beforeCut) {
            await this.options.beforeCut()
        }
        if (document.execCommand) {
            if (document.selection) {
                let range = document.body.createTextRange()
                range.moveToElementText(this.ele)
                range.select()
            } else if (window.getSelection) {
                this.ele.select()
            }
            document.execCommand("cut")
        }
        // for ie
        if (window.clipboardData) {
            window.clipboardData.setData("text", this.ele.value)
            this.ele.value = ""
        }
        // after cur=t
        if (typeof this.options.afterCut) {
            await this.options.afterCut()
        }
    }
    async paste() {
        if (this.ele.type !== "text" && this.ele.type !== "textarea") {
            return
        }
        if (typeof this.options.beforePaste) {
            await this.options.beforePaste()
        }
        if (document.execCommand) {
            let element = this.ele
            if (element.setSelectionRange) {
                element.focus()
                element.setSelectionRange(element.value.length, element.value.length)
            } else if (element.createTextRange) {
                let range = element.createTextRange()
                range.collapse(true)
                range.moveEnd("character", element.value.length)
                range.moveStart("character", element.value.length)
                range.select()
            }
            document.execCommand("paste")
        }
        // for ie
        if (!document.execCommand && window.clipboardData) {
            this.ele.value += window.clipboardData.getData("text")
        }
        // after Paste
        if (typeof this.options.afterPaste) {
            await this.options.afterPaste()
        }
    }
}

class ClipboardAction {
    constructor(options) {
        this.resolveOptions(options)
        this.initSelection()
    }
    resolveOptions(options = {}) {
        this.action = options.action
        this.container = options.container
        this.emitter = options.emitter
        this.target = options.target
        this.text = options.text
        this.trigger = options.trigger
        this.selectedText = ""
    }
    select(ele) {
        let succeeded
        let value = this.text ? this.text : ele.value || ele.innerText
        if (document.execCommand) {
            this.fakeElem = document.createElement("textarea")
            this.fakeElem.style.position = "fixed"
            this.fakeElem.style.zIndex = -99999
            this.fakeElem.style.opacity = 0
            this.fakeElem.style.height = 0
            this.fakeElem.style.width = 0
            this.fakeElem.style.overflow = "hidden"
            this.fakeElem.setAttribute("readonly", "")
            this.fakeElem.value = value
            this.container.appendChild(this.fakeElem)
            if (document.selection) {
                let range = document.body.createTextRange()
                range.moveToElementText(this.fakeElem)
                range.select()
            } else if (window.getSelection) {
                let range = document.createRange()
                range.selectNode(this.fakeElem)
                window.getSelection().removeAllRanges()
                window.getSelection().addRange(range)
            }
            try {
                succeeded = document.execCommand(this.action)
            } catch (err) {
                succeeded = false
            }
        } else if (window.clipboardData) {
            window.clipboardData.setData("text", value)
            succeeded = true
        }
        this.handleResult(succeeded);
    }
    selectFake() {
        this.removeFake()
        this.fakeHandlerCallback = () => this.removeFake()
        this.fakeHandler = this.container.addEventListener("click", this.fakeHandlerCallback) || true
        this.selectedText = this.select(this.fakeElem)
    }
    removeFake() {
        if (this.fakeHandler) {
            this.container.removeEventListener("click", this.fakeHandlerCallback)
            this.fakeHandler = null
            this.fakeHandlerCallback = null
        }

        if (this.fakeElem) {
            this.container.removeChild(this.fakeElem)
            this.fakeElem = null
        }
    }
    handleResult(succeeded) {
        this.emitter.emit(succeeded ? "success" : "error", {
            action: this.action,
            text: this.selectedText,
            trigger: this.trigger,
            clearSelection: this.clearSelection.bind(this),
        })
    }
    clearSelection() {
        if (this.trigger) {
            this.trigger.focus()
        }
        document.activeElement.blur()
        window.getSelection().removeAllRanges()
    }
    set action(action = "copy") {
        this._action = action

        if (this._action !== "copy" && this._action !== "cut") {
            throw new Error('Invalid "action" value, use either "copy" or "cut"')
        }
    }
    get action() {
        return this._action
    }
    set target(target) {
        if (target !== undefined) {
            if (target && typeof target === "object" && target.nodeType === 1) {
                if (this.action === "copy" && target.hasAttribute("disabled")) {
                    throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute')
                }

                if (this.action === "cut" && (target.hasAttribute("readonly") || target.hasAttribute("disabled"))) {
                    throw new Error(
                        'Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes'
                    )
                }

                this._target = target
            } else {
                throw new Error('Invalid "target" value, use a valid Element')
            }
        }
    }
    get target() {
        return this._target
    }
    destroy() {
        this.removeFake()
    }
}

class Clipboard {
    constructor(trigger, options) {
        this.resolveOptions(options)
        this.listenClick(trigger)
    }
    resolveOptions(options = {}) {
        this.action = typeof options.action === "function" ? options.action : this.defaultAction
        this.target = typeof options.target === "function" ? options.target : this.defaultTarget
        this.text = typeof options.text === "function" ? options.text : this.defaultText
        this.container = typeof options.container === "object" ? options.container : document.body
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
        const trigger = e.delegateTarget || e.currentTarget
        if (this.clipboardAction) {
            this.clipboardAction = null
        }
        this.clipboardAction = new ClipboardAction({
            action: this.action(trigger),
            target: this.target(trigger),
            text: this.text(trigger),
            container: this.container,
            trigger: trigger,
            emitter: this,
        })
    }
    defaultAction(trigger) {
        return getAttributeValue("action", trigger)
    }
    defaultTarget(trigger) {
        const selector = getAttributeValue("target", trigger)
        if (selector) {
            return document.querySelector(selector)
        }
    }
    defaultText(trigger) {
        return getAttributeValue("text", trigger)
    }
    destroy() {
        this.listener.destroy()

        if (this.clipboardAction) {
            this.clipboardAction.destroy()
            this.clipboardAction = null
        }
    }
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
