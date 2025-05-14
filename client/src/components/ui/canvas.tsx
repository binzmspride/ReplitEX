"use client";

import { useEffect, useRef, useState } from "react";

export interface CanvasProps {
  width?: number;
  height?: number;
  tool: "brush" | "eraser";
  color: string;
  brushSize: number;
  canvasData?: string | null;
  onSave?: (imageData: string) => void;
  className?: string;
}

export function Canvas({
  width = 500,
  height = 500,
  tool,
  color,
  brushSize,
  canvasData,
  onSave,
  className,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Set initial context properties
    context.lineJoin = "round";
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = brushSize;

    setCtx(context);

    // Load initial canvas data if provided
    if (canvasData) {
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
      img.src = canvasData;
    }

    // Cleanup function
    return () => {
      setCtx(null);
    };
  }, [width, height, canvasData]);

  // Update context when tool, color, or brush size changes
  useEffect(() => {
    if (!ctx) return;
    
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    }
    
    ctx.lineWidth = brushSize;
  }, [ctx, tool, color, brushSize]);

  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    
    setIsDrawing(true);
    
    // Get position
    const position = getEventPosition(e);
    lastPositionRef.current = position;
    
    // Begin path at current position
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
  };

  // Draw
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    
    // Prevent scrolling on touch devices
    if (e.type === 'touchmove') {
      e.preventDefault();
    }
    
    // Get current position
    const position = getEventPosition(e);
    
    // Draw line from last position to current position
    ctx.beginPath();
    ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
    ctx.lineTo(position.x, position.y);
    ctx.stroke();
    
    // Update last position
    lastPositionRef.current = position;
  };

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Helper function to get position from mouse or touch event
  const getEventPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  // Save canvas data
  const saveCanvas = () => {
    if (!canvasRef.current || !onSave) return;
    
    const imageData = canvasRef.current.toDataURL('image/png');
    onSave(imageData);
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full touch-none cursor-crosshair border border-border rounded-md shadow-sm bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
}

export { Canvas as DrawingCanvas };
