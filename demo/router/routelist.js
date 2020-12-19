const list = ["alert",
    "badge",
    "bread",
    "button",
    "checkbox",
    "circle",
    "collapse",
    "datepicker",
    "drop",
    "dropdown",
    "form",
    "grid",
    "icons",
    "input",
    "loading",
    "loadingbar",
    "message",
    "modal",
    "notice",
    "page",
    "progress",
    "radio",
    "rate",
    "select",
    "slider",
    "split",
    "step",
    "switchs",
    "table",
    "tooltip",
    "transferlist",
    "tree",
    "upload",
    // "vssearchs",
    "inputNumber",
    "carousel"
].sort();

export default function initList(type) {
    return list.map((val, index) => {
        return {
            title: val,
            id: index, //key,
            icon: "document",
            props:{to:val},
            path: val,
            name: val,
            component:
                type === "router" ? () => import(/* webpackChunkName: "components"*/"../components/" + val) : null
        };
    });
}
