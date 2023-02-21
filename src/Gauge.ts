import { BaseComponent } from "./Base";
import { RadialGauge, LinearGauge } from 'canvas-gauges';

// declare namespace GlobalMixins {
// 	interface DisplayObjectEvents {
// 		[key: string]: any;
//         animate: [string, string, number],
// 	}
// }
declare var DisplayObjectEvents: any;

export namespace Gauge {

    // export let GaugeColor: { [key: string]: string } =
    // {
    //     Plate: "#fff",
    //     MajorTicks: "#f5f5f5",
    //     MinorTicks: '#ddd',
    //     Title: '#fff',
    //     Units: '#ccc',
    //     Numbers: '#eee',
    // }

    export enum GaugeType {
        Radial = 0,
        Linear = 1
    }

    export class GaugeColor {

        private _plate: string = "#FFFF";
        private _ticks: string = "#222";
        private _title: string = "#fff";
        private _units: string = "#ccc";
        private _font: string = "#222";

        private _b_cahnged: boolean = true;

        public get b_cahnged(): boolean { return this._b_cahnged; }
        public set b_cahnged(val: boolean) { this._b_cahnged = val; }

        public get font(): string { return this._font; }
        public set font(val: string) { this._font = val; this._b_cahnged = true; }

        public get units(): string { return this._units; }
        public set units(val: string) { this._units = val; this._b_cahnged = true; }

        public get title(): string { return this._title; }
        public set title(val: string) { this._title = val; this._b_cahnged = true; }

        public get ticks(): string { return this._ticks; }
        public set ticks(val: string) { this._ticks = val; this._b_cahnged = true; }

        public get plate(): string { return this._plate; }
        public set plate(val: string) { this._plate = val; this._b_cahnged = true; }

        public constructor() { }

        public clone(): GaugeColor {
            var c = new GaugeColor();
            c._plate = this._plate;
            c._ticks = this._ticks;
            c._title = this._title;
            c._units = this._units;
            c._font = this._font;
            return c;
        }

    }
    export class Base<T> extends BaseComponent.Base<T>{


        private _gauge: any = null;
        private _gauge_type: GaugeType = GaugeType.Radial;
        private _startAngle: number = 45;
        private _ticksAngle: number = 270;

        protected _valueBox: boolean = true;
        protected _borders: boolean = true;
        private _colorPlate: string = "#FFFFFF";
        private _colorMajorTicks: string = "";
        private _colorMinorTicks: string = "";
        private _colorTitle: string = "";
        private _colorUnits: string = "";
        private _colorNumbers: string = "";
        private _colorNeedle: string = "rgba(240, 128, 128, 1)";
        private _colorNeedleEnd: string = "rgba(255, 160, 122, .9)";
        private _animationRule: string = "elastic";
        private _animationDuration: number = 750;
        private _units: string = "";
        private _title: string = "";
        private _minValue: number = 0;
        private _maxValue: number = 100;
        private _majorTicks: string[] = [];
        private _highlights: any[] = []; 
        private _needleType: string = '';
        private _needleWidth: number = 3;
        private _valueTextShadow: boolean = true;
        private _colorCircleInner: string = '#fff';
        private _colorBorderOuter: string = '#ccc';
        private _colorBorderOuterEnd: string = '#ccc';
        private _borderOuterWidth: number = 5;
        private _borderMiddleWidth: number = 0;
        private _borderInnerWidth: number = 0;
        private _needleEnd: number = 90;
        private _needleStart: number ;
        private _needleCircleOuter: boolean = false;
        private _needleCircleSize: number = 5;
        private _colorNeedleCircleOuter: string = '';
        private _minorTicks: number = 10;
        private _strokeTicks: boolean = true;
        private _colorNeedleShadowDown: string = '';
        private _borderShadowWidth: number = 0;
        private _animationTarget: string = 'needle';
        private _animateOnInit: boolean = true;

        public get needleType(): string { return this._needleType; }
        public set needleType(val: string) { this._needleType = val; this.updateOption(); }

        public get needleWidth(): number { return this._needleWidth; }
        public set needleWidth(val: number) { this._needleWidth = val; this.updateOption(); }

        public get valueTextShadow(): boolean { return this._valueTextShadow; }
        public set valueTextShadow(val: boolean) { this._valueTextShadow = val; this.updateOption(); }

        public get colorCircleInner(): string { return this._colorCircleInner; }
        public set colorCircleInner(val: string) { this._colorCircleInner = val; this.updateOption(); }

        public get colorNeedleCircleOuter(): string { return this._colorNeedleCircleOuter; }
        public set colorNeedleCircleOuter(val: string) { this._colorNeedleCircleOuter = val; this.updateOption(); }

        public get needleCircleSize(): number { return this._needleCircleSize; }
        public set needleCircleSize(val: number) { this._needleCircleSize = val; this.updateOption(); }

        public get needleCircleOuter(): boolean { return this._needleCircleOuter; }
        public set needleCircleOuter(val: boolean) { this._needleCircleOuter = val; this.updateOption(); }

        public get needleStart(): number { return this._needleStart; }
        public set needleStart(val: number) { this._needleStart = val; this.updateOption(); }

        public get needleEnd(): number { return this._needleEnd; }
        public set needleEnd(val: number) { this._needleEnd = val; this.updateOption(); }

        public get borderInnerWidth(): number { return this._borderInnerWidth; }
        public set borderInnerWidth(val: number) { this._borderInnerWidth = val; this.updateOption(); }

        public get borderMiddleWidth(): number { return this._borderMiddleWidth; }
        public set borderMiddleWidth(val: number) { this._borderMiddleWidth = val; this.updateOption(); }

        public get borderOuterWidth(): number { return this._borderOuterWidth; }
        public set borderOuterWidth(val: number) { this._borderOuterWidth = val; this.updateOption(); }

        public get colorBorderOuter(): string { return this._colorBorderOuter; }
        public set colorBorderOuter(val: string) { this._colorBorderOuter = val; this.updateOption(); }

        public get colorBorderOuterEnd(): string { return this._colorBorderOuterEnd; }
        public set colorBorderOuterEnd(val: string) { this._colorBorderOuterEnd = val; this.updateOption(); }

        public get colorNeedleShadowDown(): string { return this._colorNeedleShadowDown; }
        public set colorNeedleShadowDown(val: string) { this._colorNeedleShadowDown = val; this.updateOption(); }

        public get borderShadowWidth(): number { return this._borderShadowWidth; }
        public set borderShadowWidth(val: number) { this._borderShadowWidth = val; this.updateOption(); }

        public get animationTarget(): string { return this._animationTarget; }
        public set animationTarget(val: string) { this._animationTarget = val; this.updateOption(); }

        public get animateOnInit(): boolean { return this._animateOnInit; }
        public set animateOnInit(val: boolean) { this._animateOnInit = val; this.updateOption(); }

        public get startAngle(): number { return this._startAngle; }
        public set startAngle(val: number) { this._startAngle = val; this.updateOption();}

        public get ticksAngle(): number { return this._ticksAngle; }
        public set ticksAngle(val: number) { this._ticksAngle = val; this.updateOption();}

        public get highlights(): any[] { return this._highlights; }
        public set highlights(val: any[]) { this._highlights = val; this.updateOption(); }

        public get units(): string { return this._units; }
        public set units(val: string) { this._units = val; this.updateOption(); }

        public get title(): string { return this._title; }
        public set title(val: string) { this._title = val; this.updateOption(); }

        public get minValue(): number { return this._minValue; }
        public set minValue(val: number) { this._minValue = val; this.updateOption(); }

        public get majorTicks(): string[] { return this._majorTicks; }
        public set majorTicks(val: string[]) { this._majorTicks = val; this.updateOption(); }

        public get minorTicks(): number { return this._minorTicks; }
        public set minorTicks(val: number) { this._minorTicks = val; this.updateOption(); }

        public get strokeTicks(): boolean { return this._strokeTicks; }
        public set strokeTicks(val: boolean) { this._strokeTicks = val; this.updateOption(); }

        public get colorPlate(): string { return this._colorPlate; }
        public set colorPlate(val: string) { this._colorPlate = val; this.updateOption(); }

        public get colorMajorTicks(): string { return this._colorMajorTicks; }
        public set colorMajorTicks(val: string) { this._colorMajorTicks = val; this.updateOption(); }

        public get colorMinorTicks(): string { return this._colorMinorTicks; }
        public set colorMinorTicks(val: string) { this._colorMinorTicks = val; this.updateOption(); }

        public get colorTitle(): string { return this._colorTitle; }
        public set colorTitle(val: string) { this._colorTitle = val; this.updateOption(); }

        public get colorUnits(): string { return this._colorUnits; }
        public set colorUnits(val: string) { this._colorUnits = val; this.updateOption(); }

        public get colorNumbers(): string { return this._colorNumbers; }
        public set colorNumbers(val: string) { this._colorNumbers = val; this.updateOption(); }

        public get colorNeedle(): string { return this._colorNeedle; }
        public set colorNeedle(val: string) { this._colorNeedle = val; this.updateOption(); }

        public get colorNeedleEnd(): string { return this._colorNeedleEnd; }
        public set colorNeedleEnd(val: string) { this._colorNeedleEnd = val; this.updateOption(); }

        public get valueBox(): boolean { return this._valueBox; }
        public set valueBox(val: boolean) { this._valueBox = val; this.updateOption(); }

        public get animationRule(): string { return this._animationRule; }
        public set animationRule(val: string) { this._animationRule = val; this.updateOption(); }

        public get animationDuration(): number { return this._animationDuration; }
        public set animationDuration(val: number) { this._animationDuration = val; this.updateOption(); }

        public get borders(): boolean { return this._borders; }
        public set borders(val: boolean) { this._borders = val; this.updateOption(); }

        public get maxValue(): number { return this._maxValue; }
        public set maxValue(val: number) { this._maxValue = val; this.updateOption(); }


        constructor(opt: any = {}, type: GaugeType = GaugeType.Radial) {
            super(opt);
            this._gauge_type = type;
            setTimeout(() => {
                this.create();
                this.updateOption();
            }, 10);
        }

        protected updateOption() {
            this._options =
            {
                width: this.RenderSize.width,
                height: this.RenderSize.height,
                units: this._units,
                minValue: this._minValue,
                maxValue: this._maxValue,
                title: this._title,
                startAngle: this._startAngle,
                ticksAngle: this._ticksAngle,
                animationDuration: this._animationDuration,
                majorTicks: this._majorTicks,
                colorPlate: this._colorPlate,
                colorMajorTicks: this._colorMajorTicks,
                colorMinorTicks: this._colorMinorTicks,
                colorTitle: this._colorTitle,
                colorUnits: this._colorUnits,
                colorNumbers: this._colorNumbers,
                colorNeedle: this._colorNeedle,
                colorNeedleEnd: this._colorNeedleEnd,
                valueBox: this._valueBox,
                animationRule: this._animationRule,
                borders: this._borders,
                minorTicks: this._minorTicks,
                strokeTicks: this._strokeTicks,
                highlights: this._highlights,
                valueTextShadow: this._valueTextShadow,
                colorCircleInner: this._colorCircleInner,
                colorNeedleCircleOuter: this._colorNeedleCircleOuter,
                needleCircleSize: this._needleCircleSize,
                needleCircleOuter: this._needleCircleOuter,
                needleType: this._needleType,
                needleStart: this._needleStart,
                needleEnd: this._needleEnd,
                needleWidth: this._needleWidth,
                borderInnerWidth: this._borderInnerWidth,
                borderMiddleWidth: this._borderMiddleWidth,
                borderOuterWidth: this._borderOuterWidth,
                colorBorderOuter: this._colorBorderOuter,
                colorBorderOuterEnd: this._colorBorderOuterEnd,
                colorNeedleShadowDown: this._colorNeedleShadowDown,
                borderShadowWidth: this._borderShadowWidth,
                animationTarget: this._animationTarget,
                animateOnInit: true,
                useMinPath: false,
                value: this._val_now
            }
            if (this._gauge !== null) {
                this._gauge.update(this._options);
                console.log(2);
            }
        }

        protected perUpdate(): void {

            if (this._gauge.value != this._val_target) {
                // console.log(this._gauge.value, this._val_target,  this._val_now);
                if (this._minValue > this._val_target) {
                    this._val_target = Math.min(this._val_target as number, this._maxValue);
                    // this.emit("valueErrorMin", [this._min, this._val_target, Date.now()])
                }
                if (this._maxValue < this._val_target) {
                    this._val_target = Math.max(this._val_target as number, this._minValue);
                    // this.emit("valueErrorMax", [this._max, this._val_target, Date.now()])
                }

                // this.emit("beforeChanged", [this._val_last, this._val_target, this._gauge.value, Date.now()]);
                this._gauge.value = this._val_target;
                // this._val_now = this._gauge.value;
                // this.emit("afterChanged", [this._val_last, this._val_target, this.value, Date.now()]);
            }
        }

        
        public cloneByOpeion(data: any) {
            let keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                let val = data[key];
                (this as any)[`_${key}`] = val;
            }
            this.updateOption();
            // this._gauge.draw();
        }

        public create(): void {

            if (this._gauge_type == GaugeType.Radial) {
                this._gauge = new RadialGauge(Object.assign(this._options, { renderTo: this.canvas }));
            }
            else {
                this._gauge = new LinearGauge(Object.assign(this._options, { renderTo: this.canvas }));
            }

            this._gauge.draw();

            this._gauge.on("animate", (percent: number, value: number) => {
                this.texture.update();
                this._val_now = value;
                // this.emit("animate", this._val_now, this._val_target as number, Date.now());
            });
            this._gauge.on("animationEnd", () => {

                // this.emit("afterAnimation", _gauge_colors[this._val_last, this._val_target, Date.now()]);
            });
        }

        public createByJsonObj(data: any): void {

            // let { min, max, duration, valueBox, border, colors, position, size, Equation } = data;
            // this._minValue = min ?? 0;
            // this._maxValue = max ?? 100;
            // this._duration = duration ?? 1000;
            // this._valueBox = valueBox ?? true;
            // this._border = border ?? true;
            // // this.position.set( position.x, position.y);
            // this.RenderSize.height = size.height;
            // this.RenderSize.width = size.width;

            // // this.value = 155;
            // console.log(this.position, this.canvas.height, this.sprite.height)
            // if (colors != null) {
            //     let c = new GaugeColor();
            //     this.colors = c;
            // }

            // let c = new GaugeColor();
            // this.colors = c;
            // this.updateOption();

        }
        protected override update(): void {
            super.update();
        }

        public clone(): Radial | Linear {

            let res: Radial | Linear = null;
            var opt = this._options;


            switch (this._gauge_type) {
                case GaugeType.Linear:
                    res = new Linear();
                    res.cloneByOpeion(opt);
                    res.value = this.value;
                    break;
                case GaugeType.Radial:
                    res = new Radial();
                    res.cloneByOpeion(opt);
                    res.value = this.value;
                    break;
            }
            return res;
        }


        public getValues() {

            return [this._val_last, this._val_now, this._val_target];
        }

    }

    export class Radial extends Base<Radial> {

        constructor() {
            super({}, GaugeType.Radial);
            // this.updateOption();
        }
    }

    export class Linear extends Base<Linear> {

        constructor() {
            super({}, GaugeType.Linear);
            // this.updateOption();
        }
    }
}