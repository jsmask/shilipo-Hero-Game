import { Application, Loader, Container } from "pixi.js";
import assets from "./assets"
import { setTextures, getTexturesAll } from "./textures"
import Bus from "@/utils/bus"
import MainScene from "./mainScene"
import BeginScene from "./beginScene";
import EndScene from "./endScene";

export default class Game {
  constructor(options = {}) {
    this.width = 800;
    this.height = 600;
    this.el = document.querySelector("div")
    this.resolution = 1;
    this.onProgress = function () { }
    Object.assign(this, options)
    return this;
  }
  init() {
    let { resolution, width, height, el } = this;
    this.app = new Application({
      width: width,
      height: height,
      backgroundColor: 0x000000,
      resolution: resolution || 1,
      antialias: true,
      autoDensity: true,
      preserveDrawingBuffer: true,
    });

    el.appendChild(this.app.view);

    this.stage = this.app.stage;
    this.stage.sortableChildren = true;
    this.stage.interactive = true;

    this.beginScene = new BeginScene(this)
    this.stage.addChild(this.beginScene.stage)

    this.mainScene = new MainScene(this)
    this.stage.addChild(this.mainScene.stage)

    this.endScene = new EndScene(this)
    this.stage.addChild(this.endScene.stage)

    this.loader = new Loader();

    this.loaderTextures().then(res => {
      Object.entries(res).forEach(([key, value]) => setTextures(key, value.texture))
      console.log(getTexturesAll())
      this.render()
    })

    return this;
  }
  destroy() {
    this.app.destroy(true, true);
  }
  loaderTextures() {
    const { loader, onProgress } = this;
    return new Promise((resolve, reject) => {
      Object.entries(assets).forEach(([key, value]) => loader.add(key, value, () => {
        onProgress(loader.progress)
      }))
      loader.load((loader, resources) => {
        onProgress(loader.progress)
        resolve(resources)
      })
    })
  }
  render() {
    this.draw();
    this.update();
    Bus.$on("gameover", e => {
      this.endScene.init(e).show();
    })
    Bus.$on("reset", () => {
      this.beginScene.show();
      this.mainScene.init().show();
    })
    Bus.$on("restart", () => {
      this.mainScene.init().beginGame()
    })
    Bus.$on("startGame", () => {
      this.beginScene.init().hide();
      this.mainScene.init().onStart()
    })
  }
  draw() {
    this.beginScene.init().show();
    this.mainScene.init().show();
    // this.endScene.init().show();
  }
  update() {
    this.app.ticker.add((delta) => {
      this.mainScene.update(delta)
    })
  }
}