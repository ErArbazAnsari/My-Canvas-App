const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;
let x = 0;
let y = 0;
let color = "#000000";
let brushSize = 1;
let drawingTool = "pencil";
let shapes = [];
let bgColor = "#FFFFFF";

// Set up canvas
function setupCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    redrawShapes();
}

setupCanvas();

function redrawShapes() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((shape) => {
        drawShape(ctx, shape);
    });
}

function drawSmoothLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}

function drawShape(context, shape) {
    const { tool, x1, y1, x2, y2, color, brushSize } = shape;
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    switch (tool) {
        case "rectangle":
            context.rect(x1, y1, x2 - x1, y2 - y1);
            break;
        case "circle":
            const radius = Math.sqrt(
                Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
            );
            context.arc(x1, y1, radius, 0, Math.PI * 2);
            break;
        default:
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            break;
    }
    context.stroke();
    context.closePath();
}

// Event listeners for drawing
canvas.addEventListener("mousedown", (e) => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
});

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        if (drawingTool === "pencil") {
            drawSmoothLine(ctx, x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        } else {
            redrawShapes();
            drawShape(ctx, {
                tool: drawingTool,
                x1: x,
                y1: y,
                x2: e.offsetX,
                y2: e.offsetY,
                color,
                brushSize,
            });
        }
    }
});

canvas.addEventListener("mouseup", (e) => {
    if (isDrawing) {
        shapes.push({
            tool: drawingTool,
            x1: x,
            y1: y,
            x2: e.offsetX,
            y2: e.offsetY,
            color,
            brushSize,
        });
        isDrawing = false;
        x = 0;
        y = 0;
    }
});

// Reset canvas
document.getElementById("resetCanvas").addEventListener("click", () => {
    shapes = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Download canvas as image
document.getElementById("downloadCanvas").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = canvas.toDataURL();
    link.click();
});

// Upload and modify image on canvas
document.getElementById("uploadImage").addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

// Toggle theme
document.getElementById("toggleTheme").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
});

// Change brush color
document.getElementById("colorPicker").addEventListener("input", (e) => {
    color = e.target.value;
});

// Change brush size
document.getElementById("brushSize").addEventListener("input", (e) => {
    brushSize = e.target.value;
});

// Change canvas background color
document.getElementById("bgColorPicker").addEventListener("input", (e) => {
    bgColor = e.target.value;
    redrawShapes();
});

// Select pencil tool
document.getElementById("pencil").addEventListener("click", () => {
    drawingTool = "pencil";
});

// Select shapes
document.getElementById("drawLine").addEventListener("click", () => {
    drawingTool = "line";
});
document.getElementById("drawRect").addEventListener("click", () => {
    drawingTool = "rectangle";
});
document.getElementById("drawCircle").addEventListener("click", () => {
    drawingTool = "circle";
});

// Initial setup
setupCanvas();

// Resize canvas to maintain responsiveness
window.addEventListener("resize", setupCanvas);
