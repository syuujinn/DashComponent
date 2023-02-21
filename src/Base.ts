import { Texture, Sprite, Graphics, Point, DisplayObject, Rectangle, IPointData, BaseTexture, Resource, IAutoDetectOptions, Assets } from 'pixi.js';
import { Subject } from 'rxjs';


export enum ComponentType {
    None = 0,
    RadialGauge = 1,
    LineGauge = 2,
    Chart = 3,
    Image = 4,
    Media = 5,
    Canvas = 6,
    Container = 7
}

export enum SourceType {
    Static = 1,
    API = 2,
    Stream = 3,
    MediaStream = 4
}

export const SourceTypeMap: { [key: string]: any } = {
    "static": SourceType.Static,
    "api": SourceType.API,
    "stream": SourceType.Stream,
    "media": SourceType.MediaStream
};

export namespace BaseComponent {

    export class RenderSize {

        private _width: number = 0;
        private _height: number = 0;

        public get height(): number { return this._height; }
        public set height(val: number) { this._height = Math.max(0, val); }

        public get width(): number { return this._width; }
        public set width(val: number) { this._width = Math.max(0, val); }

        constructor(width: number, height: number) {
            this._width = Math.max(0, width);
            this._height = Math.max(0, height);
        }
    }

    export abstract class Base<T> extends Sprite {
        
        private _name: string = "";
        private _canvas: HTMLCanvasElement = null;
        private _child_texture: Texture = null;
        private _render_size: RenderSize = new RenderSize(300, 300);
        private _source_type: SourceType = SourceType.Static;
     
        private _sprite: Sprite = null;
        private _children: Sprite[] = [];
        private _source: number | string = 0;
        private _is_active: boolean = true;
        private _status: any = {};
        private _equation: string = "";

        protected _value: number | string | number[] = 0;
        protected _options: any = {};
        protected _val_last: number | string | number[] = 0;
        protected _val_now: number | string | number[] = 0;
        protected _val_target: number | string | number[] = 0;
        protected _timestamp: number = 0;
        protected _system_update_interval: number = 32;   
        protected _decimals: number = 2; 

        public get decimals(): number{ return this._decimals; }
        public set decimals(val: number){ this._decimals = val; }

        public get RenderSize(): BaseComponent.RenderSize { return this._render_size; }
        public set RenderSize(val: BaseComponent.RenderSize) { this._render_size = val }

        public get child_texture(): Texture { return this._child_texture; }
        public set child_texture(val: Texture) { this._child_texture = val; }

        public get value_now(): number | string | number[] { return this._val_now; }
        public get value_target(): number | string | number[] { return this._val_target; }

        public get value(): number | string | number[] { return this._value; }
        public set value(val: number | string | number[]) { this._val_last = this.value; this._value = val; }

        public get source(): number | string { return this._source; }
        public set source(val: number | string) { this._source = val; }

        public get equation(): string { return this._equation; }
        public set equation(val: string) { this._equation = val; this.setEquation(); }

        public get is_active(): boolean { return this._is_active; }
        public set is_active(val: boolean) { this._is_active = val; console.log() }

        public get sprite(): Sprite { return this._sprite; }
        public set sprite(val: Sprite) { this._sprite = val; }

        public get canvas(): HTMLCanvasElement { return this._canvas; }
        public set canvas(val: HTMLCanvasElement) { this._canvas = val; }

        public get options(): any { return this._options; }
        public set options(val: any) { this._options = val; }

        public get status(): any { return this._status; }
        public set status(val: any) { this._status = val; }

        public static ContainerBaseComponent: { [key: string]: any } = {};

        constructor(opts: any = {}) {
            super();
            this._options = opts;
            this._canvas = document.createElement("canvas");
            this._canvas.width = this._render_size.width;
            this._canvas.height = this._render_size.height;
            this._canvas.style.display = "none";
            this._child_texture = Texture.from(this._canvas);
            this._sprite = new Sprite(this._child_texture);
            this.anchor.set(0.5, 0.5);

            this._val_last = 0;
            this._val_now = 0;
            this._val_target = 0;

            document.body.append(this._canvas);
            this._status = {}
            this.addChild(this._sprite);
            this.setEquation();
            setInterval(() => { this.update(); }, this._system_update_interval);
        }

        // public on(event: string, listener: Function): void {

        //     if (event in this._container_evt)
        //         this._container_evt[event].push(listener);
        //     else
        //         this._container_evt[event] = [listener];
        // }

        // public off(event: string): void {
        //     this._container_evt[event].splice(0);
        // }

        // public emit(event: string, args: any[]) {

        //     if (event in this._container_evt) {
        //         this._container_evt[event].forEach(ce => {
        //             ce.call(this, args);
        //         })
        //     }
        // }

        public abstract create(): void
        public abstract createByJsonObj(data: any): void
        protected abstract perUpdate(): void


        private setEquation() {

            this.updateFunction = eval(`()=>{ let result = this.value; let args = this.value; ${this._equation}  this._val_target = result; }`);
        }

        private updateFunction() {
        }

        protected update(): void {

            this.updateFunction();
            this.perUpdate();
            if (this._is_active)
                this._child_texture.update();

            this._timestamp = Date.now();
        }

        public abstract clone(): any


    }
    
    /**
     * 生成一個格式為 xxxx-xxxx-xxxx-xxxx 的隨機數據。
     * @param {string} prefix - 數據的前綴，可自定義。
     * @returns {string} - 返回生成的隨機數據。
     */
    export function generateRandomData(prefix: string): string {
        
        const blocks = [];
        for (let i = 0; i < 4; i++) {
          const block = Math.floor(Math.random() * 65536).toString(16).padStart(4, "0");
          blocks.push(block);
        }
        const result = `${prefix}-${blocks.join("-")}`;
        return result;
      }

    
    /**
     * Converts an HSL color value to its equivalent HEX value.
     *
     * @param {number} h - The hue value of the HSL color, in degrees (0-360).
     * @param {number} s - The saturation value of the HSL color, as a percentage (0-100).
     * @param {number} l - The lightness value of the HSL color, as a percentage (0-100).
     *
     * @returns {string} - The HEX value of the HSL color, as a 6-character string.
     */
    export function hslToHex(h: number, s: number, l: number) {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c / 2;
        let r = 0;
        let g = 0;
        let b = 0;
        let rs;
        let gs;
        let bs;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        // Having obtained RGB, convert channels to hex
        rs = Math.round((r + m) * 255).toString(16);
        gs = Math.round((g + m) * 255).toString(16);
        bs = Math.round((b + m) * 255).toString(16);

        // Prepend 0s, if necessary
        if (rs.length === 1) { rs = '0' + rs; }
        if (gs.length === 1) { gs = '0' + gs; }
        if (bs.length === 1) { bs = '0' + bs; }
        return rs + gs + bs;
    }
}


export class Skin extends BaseTexture {

    private _is_ready: boolean = false;
    private _source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | string;

    private _extends_options: any = { timer: 10 };

    private _texture_updated: Subject<void> = new Subject<void>();

    public get is_ready(): boolean { return this._is_ready; }
    public set is_ready(val: boolean) { this._is_ready = val; }

    public get source(): HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | string { return this._source; }
    public set source(val: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | string) { this._source = val; }

    public get extends_options(): any { return this._extends_options; }
    public set extends_options(val: any) { this._extends_options = val; }

    public onupdated$ = this._texture_updated.asObservable();

    constructor(source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | string, opt: any = {}) {
        super();

        this._source = source;

        if (typeof (source) == "string") {
            console.log("string");
            Assets.load(source as string).then((res: any) => { console.log(res); })
        }
        else if (source instanceof HTMLImageElement) {
            console.log("HTMLImageElement");
        }
        else if (source instanceof HTMLCanvasElement) {
            console.log("HTMLCanvasElement");
        }
        else if (source instanceof HTMLVideoElement) {
            { console.log("HTMLVideoElement"); }
        }

        this._extends_options = Object.assign(this._extends_options, opt);




    }

    private load() {

    }
}