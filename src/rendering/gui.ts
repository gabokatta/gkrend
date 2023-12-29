import { GUI } from "dat.gui";


var gui = new GUI({ autoPlace:false, width:200 });
document.querySelector('.gui-container')?.append(gui.domElement);