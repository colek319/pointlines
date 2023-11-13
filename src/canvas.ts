interface PointLines {
    points: [number, number][],
    lines: [number, number][],
    dualPoints: [number, number][],
    dualLines: [number, number][],
}

enum Space {
    Primal,
    Dual
}

const setupCanvas = (element: HTMLCanvasElement) => {
    const ctx: CanvasRenderingContext2D | null = element.getContext('2d')
    if (!ctx) {
        console.log("setupCanvas: no context in canvas element");
        return
    }
    ctx.canvas.width = 800;
    ctx.canvas.height = 9*ctx.canvas.width/16;
    let selectedSpace: Space = Space.Primal
    let pointLines: PointLines = { points: [], lines: [], dualPoints: [], dualLines: [] }
    const drawCanvas = onDrawCanvas({ ctx, selectedSpace, pointLines })
    element.addEventListener('click', onClick({ selectedSpace, pointLines, drawCanvas }))
    return
}

interface onClickParams {
    selectedSpace: Space,
    pointLines : PointLines
    drawCanvas: () => void;
}

const onClick = ({ pointLines, drawCanvas }: onClickParams) => {
    return (event: MouseEvent) => {
        console.log("handleClick: ", event.clientX, event.clientY);
        pointLines.points.push([event.clientX, event.clientY])
        drawCanvas()
    }
}

interface onDrawCanvasParams {
    ctx: CanvasRenderingContext2D,
    selectedSpace: Space
    pointLines: PointLines
}

const onDrawCanvas = ({ ctx, selectedSpace, pointLines }: onDrawCanvasParams) => {
    return () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        if (selectedSpace == Space.Primal) {
            console.log("onDrawCanvas: primal")
            drawPoints(ctx, "#7303fc", pointLines.points)
            drawLines(ctx, "#7303fc", pointLines.lines)
        } else {
            console.log("onDrawCanvas: dual")
        }
    }
}

const drawPoints = (ctx: CanvasRenderingContext2D, color: string, points: [number, number][]) => {
    ctx.fillStyle = color
    points.forEach(([x, y]) => {
        const boundingRect = ctx.canvas.getBoundingClientRect()
        const relX = x - boundingRect.width;
        const relY = y - boundingRect.height;
        console.log("drawPoints: ", relX, relY)
        ctx.beginPath()
        ctx.arc(relX, relY, 5, 0, 2 * Math.PI)
        ctx.fill()
    })
}

const drawLines = (ctx: CanvasRenderingContext2D, color: string, lines: [number, number][]) => {
    ctx.strokeStyle = color
    lines.forEach(([x, y]) => {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height)
        ctx.stroke()
    })
}

export default setupCanvas