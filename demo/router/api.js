
import Vue from 'vue'
//import API from '../../src/api'
import Index from "../components/index";
import alert from "../components/alert";
import badge from "../components/badge";
import bread from "../components/bread";
import button from "../components/button";
import checkbox from "../components/checkbox";
import circle from "../components/circle";
import collapse from "../components/collapse";
import datepicker from "../components/datepicker";
import drop from "../components/drop";
import dropdown from "../components/dropdown";
import form from "../components/form";
import grid from "../components/grid";
import icons from "../components/icons";
import input from "../components/input";
import inputNumber from "../components/inputNumber";
import loading from "../components/loading";
import loadingbar from "../components/loadingbar";
import message from "../components/message";
import modal from "../components/modal";
import notice from "../components/notice";
import page from "../components/page";
import progress from "../components/progress";
import radio from "../components/radio";
import rate from "../components/rate";
import select from "../components/select";
import slider from "../components/slider";
import split from "../components/split";
import step from "../components/step";
import switchs from "../components/switchs";
import table from "../components/table";
import tooltip from "../components/tooltip";
import transferlist from "../components/transferlist";
import tree from "../components/tree";
import upload from "../components/upload";
import vssearchs from "../components/vssearchs"

export default {
    path: '/components',
    component: Index,
    children: [
        {
            path: "alert",
            component: alert
        }, {
            path: "badge",
            component: badge
        }, {
            path: "bread",
            component: bread
        }, {
            path: "button",
            component: button
        }, {
            path: "checkbox",
            component: checkbox
        }, {
            path: "circle",
            component: circle
        }, {
            path: "collapse",
            component: collapse
        }, {
            path: "datepicker",
            component: datepicker
        }, {
            path: "drop",
            component: drop
        }, {
            path: "dropdown",
            component: dropdown
        }, {
            path: "form",
            component: form
        }, {
            path: "grid",
            component: grid
        }, {
            path: "icons",
            component: icons
        }, {
            path: "input",
            component: input
        }, {
            path: "inputNumber",
            component: inputNumber
        }, {
            path: "loading",
            component: loading
        }, {
            path: "loadingbar",
            component: loadingbar
        }, {
            path: "message",
            component: message
        }, {
            path: "modal",
            component: modal
        }, {
            path: "notice",
            component: notice
        }, {
            path: "page",
            component: page
        }, {
            path: "progress",
            component: progress
        }, {
            path: "radio",
            component: radio
        }, {
            path: "rate",
            component: rate
        }, {
            path: "select",
            component: select
        }, {
            path: "slider",
            component: slider
        }, {
            path: "split",
            component: split
        }, {
            path: "step",
            component: step
        }, {
            path: "switchs",
            component: switchs
        }, {
            path: "table",
            component: table
        }, {
            path: "tooltip",
            component: tooltip
        }, {
            path: "transferlist",
            component: transferlist
        }, {
            path: "tree",
            component: tree
        }, {
            path: "upload",
            component: upload
        }, {
            path: "vssearchs",
            component: vssearchs
        }
    ]
}
