import { BaseComponent } from "./Base";
import { Text } from "pixi.js";

export namespace Fonts {


    export class Digital extends BaseComponent.Base<Digital>{

        private _size: Number = 24;
        private _family: string = "Digital 7";
        private _color: string = "0x000";
        private _storke: string = "0x00";
        private _txt: Text = null;
        private _duration: number = 0;
        private _tmp_timestamp: number = 0;
        private _tmp_interval_value: number = 0;
        private _tmp_value: number = 0;

        public get duration(): number { return this._duration; }
        public set duration(val: number) { this._duration = val; }

        public get txt(): Text { return this._txt; }
        public set txt(val: Text) { this._txt = val; }

        public get storke(): string { return this._storke; }
        public set storke(val: string) { this._storke = val; this.updateOption(); }

        public get color(): string { return this._color; }
        public set color(val: string) { this._color = val; this.updateOption(); }

        public get family(): string { return this._family; }
        public set family(val: string) { this._family = val; this.updateOption(); }

        public get size(): Number { return this._size; }
        public set size(val: Number) { this._size = val; this.updateOption(); }

        constructor(color: string = "0x000", storke: string = "0x00", size: Number = 24, duration: number = 0, decimals: number = 2) {
            super({});
            this._color = color;
            this._storke = storke;
            this._size = size;
            this._duration = duration;
            this._decimals = decimals;
            this.create();
        }

        private animation() {

            if (this._tmp_timestamp > Date.now()) {

                let dec = Math.pow(10, this._decimals);
                this._val_now = Math.round( dec * (this._tmp_interval_value + (this._val_now as number))) / dec;
                this._txt.text = this._val_now;
                this._tmp_value = this._val_target as number;
                setTimeout(() => {
                    this.animation();
                }, this._system_update_interval);
            }
            else {
                this._txt.text = this._val_target as string;
                this._val_now = this._val_target;
                this._tmp_value = this._val_target as number;
            }

        }

        public create(): void {
            this._txt = new Text("",
                {
                    fontFamily: this._family,
                    fontSize: this._size as number,
                    fill: this._color,
                    align: 'center'
                }
                , this.canvas);
            this.addChild(this._txt);
        }

        public createByJsonObj(data: any): void {

        }

        private updateOption() {
            this._txt.style.fontFamily = this._family;
            this._txt.style.fontSize = this._size as number;
            this._txt.style.fill = this._color;
        }

        public perUpdate(): void {

            if (this._tmp_value != this._val_target) {
                if (!isNaN(this._val_target as number) && this._duration > 0) {
                    let dec = Math.pow(10, this._decimals);
                    this._tmp_timestamp = Date.now() + this._duration;
                    this._tmp_interval_value = Math.round((this._val_target as number - (this._val_now as number)) / (this._duration / this._system_update_interval) * dec) / dec ;
                    this.animation();
                } else {
                    this._txt.text = this._val_target as string;
                    this._val_now = this._val_target;
                    this._tmp_value = this._val_target as number;
                }
            }
        }

        public clone() {
            return new Digital(this._color, this._storke, this._size, this._duration, this._decimals);

        }


    }
}