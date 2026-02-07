import React, { useRef, useEffect, useState } from 'react';

interface CanvasBoardProps {
  onDrawEnd?: () => void;
  disabled: boolean;
  width?: number;
  height?: number;
}

// Expose a method to get blob to parent via ref or callback, here using forwardRef for ImperativeHandle is cleaner,
// but for simplicity in this stack, we'll pass a ref object from parent or use a callback to return data.
// Let's use a simpler approach: Parent passes a ref that we assign methods to.

export interface CanvasBoardRef {
  clear: () => void;
  getBlob: () => Promise<Blob | null>;
  isEmpty: () => boolean;
}

const CanvasBoard = React.forwardRef<CanvasBoardRef, CanvasBoardProps>(({ disabled, width = 300, height = 200 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  React.useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
      }
    },
    isEmpty: () => !hasDrawn,
    getBlob: () => {
      return new Promise((resolve) => {
        const canvas = canvasRef.current;
        if (!canvas) resolve(null);
        else canvas.toBlob((blob) => resolve(blob), 'image/png');
      });
    }
  }));

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#333';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Prevent scrolling on touch
    if (e.type === 'touchmove') {
       // e.preventDefault(); // handled by css touch-action: none
    }

    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Handle Resize/Init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      // Re-set context props after resize
      const ctx = canvas.getContext('2d');
      if(ctx) {
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.strokeStyle = '#333';
      }
    }
  }, [width, height]);

  return (
    <div className={`relative rounded-2xl border-4 ${disabled ? 'border-gray-200 bg-gray-100 opacity-60' : 'border-blue-300 bg-white'} overflow-hidden shadow-inner`}>
       <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="touch-none cursor-crosshair"
      />
      {!disabled && !hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-300 text-xl font-bold">
            Write here
          </div>
      )}
    </div>
  );
});

export default CanvasBoard;