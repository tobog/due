import Component from "./src/index";
import ComponentItem from "./src/fluidPanel";
import { componentInstall } from "../../utils/tool";
import "./index.scss";

export default componentInstall([Component, ComponentItem]);