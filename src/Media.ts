import { BaseComponent } from "./Base";
import { Texture, BaseTexture } from 'pixi.js';

export namespace Media {

    export enum MediaType {
        Image = 0,
        Video = 1
    }

    export class Video extends BaseComponent.Base<Video>{

        private _video_dom: HTMLVideoElement = null;
        private _ctx: CanvasRenderingContext2D = null;
        private _src: string = "";
        private _tmp_src: string = "";

        public get src(): string { return this._src; }
        public set src(val: string) { this.setSrc(val); }


        constructor(opt: any = {}) {
            super(opt);
            this._ctx = this.canvas.getContext('2d');
            // this.is_active = false;
        }

        public create(): void {
            this._video_dom = document.createElement("video");
            document.body.appendChild(this._video_dom);
        }

        public createByJsonObj(data: any): void {

        }

        private setSrc(src: string) {
            console.log(src);
            if (this._video_dom == null)
                this.create();
            this._video_dom.onload = () => {
                this.canvas.width = this.RenderSize.width;
                this.canvas.height = this.RenderSize.height;
                this.is_active = true;
            }
            this._video_dom.src = src;;
            this._tmp_src = src;
            // let img = new window.Image();
            // img.src = src;
            // img.onload = () => {
            //     this.canvas.width = this.RenderSize.width;
            //     this.canvas.height = this.RenderSize.height;
            //     this._ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.RenderSize.width, this.RenderSize.height);
            // }
            // this._tmp_src = src;

            // if (this._video_dom == null)
            //     this.create();
            // this.texture = Texture.from(src);
            // this.sprite.texture = this.texture;
            // }      
        }

        public perUpdate(): void {

            if (this._tmp_src != this._val_target) {
                this.setSrc(this._val_target as string);
            }

            if (this._video_dom != null && this.is_active) {
                this._ctx.drawImage(this._video_dom, 0, 0, this._video_dom.width, this._video_dom.height, 0, 0, this.RenderSize.width, this.RenderSize.height);
                
            }
        }


        public clone(): Video {
            return null;
        }
    }

    export class Image extends BaseComponent.Base<Image>{

        private _ctx: CanvasRenderingContext2D = null;
        private _src: string = "";
        private _tmp_src: string = "";


        public get src(): string { return this._src; }
        public set src(val: string) { this.setSrc(val); }

        constructor(opt: any = {}) {
            super(opt);
            this._ctx = this.canvas.getContext('2d');
        }

        public create(): void { }

        private setSrc(src: string) {

            this.create();
            let img = new window.Image();
            img.src = src;
            img.onload = () => {
                this.canvas.width = this.RenderSize.width;
                this.canvas.height = this.RenderSize.height;
                this._ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.RenderSize.width, this.RenderSize.height);
            }
            this._tmp_src = src;
        }

        public perUpdate(): void {

            if (this._tmp_src != this._val_target) {
                this.setSrc(this._val_target as string);
            }

        }

        public createByJsonObj(data: any): void {

        }

        public clone(): Image {
            return null;
        }
    }

}