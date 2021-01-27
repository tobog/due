import Vue from "vue"

export {Affix} from "./affix"
export {Alert} from "./alert"
export {Anchor} from "./anchor"
export {Avatar} from "./avatar"
export {Badge} from "./badge"
export {Bread, BreadItem} from "./breadcrumb"
export {Button, ButtonGroup} from "./button"
export {Card} from "./card"
export {Carousel, CarouselItem} from "./carousel"
export {Cascader, Caspanel} from "./cascader"
export {Checkbox, CheckboxGroup} from "./checkbox"
export {Circle, Circle as DueCircle} from "./circle"
export {Collapse, CollapseItem} from "./collapse"
export {ColorPicker, Color} from "./color-picker"
export {DatePicker, DatePickerOptions, DateBase, DatePanel} from "./date-picker"
export {Dragmove} from "./dragmove"
export {Drawer} from "./drawer"
export {Dropdown, DropdownItem} from "./dropdown"
export {Fluid, FluidPanel} from "./fluid"
export {Form, FormItem} from "./form"
export {Row, Col, Grid, GridItem} from "./grid"
export {Icon} from "./icon"
export {Input} from "./input"
export {InputNumber} from "./input-number"
export {Scroll} from "./scroll"
export {Split} from "./split"
export {Layout} from "./layout"
export {LoadingBar, LoadingBarConfig} from "./loading-bar"
export {Menu, MenuGroup, MenuItem, Submenu} from "./menu"
export {Message, MessageConfig} from "./message"
export {Modal, ModalInstance, ModalConfig} from "./modal"
export {Notice, NoticeConfig, NoticeGlobalConfig} from "./notice"
export {Page} from "./page"
export {Poptip} from "./poptip"
export {Progress} from "./progress"
export {Radio, RadioGroup} from "./radio"
export {Rate} from "./rate"
export {Select, Option, OptionGroup} from "./select"
export {Sider} from "./sider"
export {Slider} from "./slider"
export {Spin} from "./spin"
export {Steps, StepsStep} from "./steps"
export {Switch, Switch as ISwitch} from "./switch"
export {
    Table,
    TableColumn,
    TableRenderCreateElementData,
    TableColumnRenderParams,
    TableColumnRenderHeadParams,
    TableExportCsvParams,
} from "./table"
export {Tabs, TabPane} from "./tabs"
export {Tag} from "./tag"
export {Time} from "./time"
export {Timeline, TimelineItem} from "./timeline"
export {TimePicker} from "./time-picker"
export {Tooltip} from "./tooltip"
export {Transfer} from "./transfer"
export {Tree, TreeChild} from "./tree"
export {Upload} from "./upload"

interface DueGlobalOptions {
    size?: string
    transfer?: boolean | string
    select: {
        arrow: string
        customArrow: string
        arrowSize: number | string
    }
    cell: {
        arrow: string
        customArrow: string
        arrowSize: number | string
    }
    menu: {
        arrow: string
        customArrow: string
        arrowSize: number | string
    }
    tree: {
        arrow: string
        customArrow: string
        arrowSize: number | string
    }
    cascader: {
        arrow: string
        customArrow: string
        arrowSize: number | string
        itemArrow: string
        customItemArrow: string
        itemArrowSize: number | string
    }
    colorPicker: {
        arrow: string
        customArrow: string
        arrowSize: number | string
    }
    datePicker: {
        icon: string
        customIcon: string
        iconSize: number | string
    }
    timePicker: {
        icon: string
        customIcon: string
        iconSize: number | string
    }
    tabs: {
        closeIcon: string
        customCloseIcon: string
        closeIconSize: number | string
    }
    modal: {
        maskClosable: boolean | string
    }
}

interface DueInstallOptions extends DueGlobalOptions {
    locale?: any
    i18n?: any
}

declare const API: {
    version: string
    // locale: (l: any) => void;
    // i18n: (fn: any) => void;
    install: (Vue: Vue, opts: DueInstallOptions) => void
    lang: (code: string) => void
}

export default API

declare module "vue/types/vue" {
    interface Vue {
        $DUE: DueGlobalOptions
    }
}
