import Component from "./src/index";
import ComponentCaspanel from "./src/caspanel.vue";
import { componentInstall } from "../../utils/tool";
import "./index.scss";

export default componentInstall([Component, ComponentCaspanel]);