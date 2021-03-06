import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { FastBubbleRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBubbleRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { XyzDataSeries } from "scichart/Charting/Model/XyzDataSeries";
import { EFillPaletteMode, IFillPaletteProvider } from "scichart/Charting/Model/IPaletteProvider";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import { ScaleAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/ScaleAnimation";

const divElementId = "bubbleChart";

const animation = new ScaleAnimation({ zeroLine: -100, duration: 1000 });

const drawExample = async () => {
    // Create a SciChartSurface with X,Y Axis
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));

    // Line Series
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#FFFFFF",
        strokeThickness: 2,
        animation
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    // Bubble Series
    const bubbleSeries = new FastBubbleRenderableSeries(wasmContext, {
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 64,
            height: 64,
            strokeThickness: 0,
            fill: "#4682b477"
        }),
        // Optional: Allows per-point colouring of bubble stroke
        paletteProvider: new BubblePaletteProvider(),
        animation
    });
    sciChartSurface.renderableSeries.add(bubbleSeries);

    // Populate data to both series
    const lineDataSeries = new XyDataSeries(wasmContext);
    const bubbleDataSeries = new XyzDataSeries(wasmContext);
    const POINTS = 20;
    let prevYValue = 0;
    for (let i = 0; i < POINTS; i++) {
        const curYValue = Math.sin(i) * 10 - 5;
        const size = Math.sin(i) * 60 + 3;

        lineDataSeries.append(i, prevYValue + curYValue);
        bubbleDataSeries.append(i, prevYValue + curYValue, size);

        prevYValue += curYValue;
    }

    // Assign dataSeries to renderableSeries
    lineSeries.dataSeries = lineDataSeries;
    bubbleSeries.dataSeries = bubbleDataSeries;

    // Add some zooming and panning behaviour
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

/**
 * Optional: An example PaletteProvider which implements IPointMarkerPaletteProvider
 * This can be attached to Scatter or Bubble series to change the stroke or fill
 * of the series point-markers conditionally
 */
class BubblePaletteProvider implements IFillPaletteProvider {
    /**
     * This property chooses how fill colors are blended when they change.
     * Bubble Series, however, supports solid color interpolation only.
     */
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    private fill: number = parseColorToUIntArgb("red");

    public onAttached(parentSeries: IRenderableSeries): void {}
    public onDetached(): void {}

    public overrideFillArgb(xValue: number, yValue: number, index: number): number {
        //@ts-ignore
        return xValue >= 10 && xValue <= 12 ? this.fill : undefined;
    }
}

export default function BubbleChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} />;
}