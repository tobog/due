import Component from "./src/index";
import ComponentGroup from "./src/group.vue";
import { componentInstall } from "../../utils/tool";
import "./index.scss";

export default componentInstall([Component, ComponentGroup]);