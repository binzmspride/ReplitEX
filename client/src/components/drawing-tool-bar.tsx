import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  PaintbrushVertical, 
  Eraser, 
  Save, 
  Trash2 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawingToolBarProps {
  tool: "brush" | "eraser";
  color: string;
  brushSize: number;
  onToolChange: (tool: "brush" | "eraser") => void;
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onSave: () => void;
  onClear: () => void;
  isSaving?: boolean;
}

export function DrawingToolBar({
  tool,
  color,
  brushSize,
  onToolChange,
  onColorChange,
  onBrushSizeChange,
  onSave,
  onClear,
  isSaving = false,
}: DrawingToolBarProps) {
  const predefinedColors = [
    { value: "#E91E63", label: "Primary Pink" },
    { value: "#EF4444", label: "Red" },
    { value: "#F9A8D4", label: "Light Pink" },
    { value: "#8B5CF6", label: "Purple" },
    { value: "#000000", label: "Black" },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="font-medium text-lg text-gray-800">Canvas</h2>
        <div className="flex space-x-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={onSave} 
            disabled={isSaving}
          >
            <Save className="mr-1 h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClear}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <div className="p-3 bg-white border-b border-gray-200 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant={tool === "brush" ? "default" : "outline"}
            onClick={() => onToolChange("brush")}
            title="Brush"
          >
            <PaintbrushVertical className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            size="icon"
            variant={tool === "eraser" ? "default" : "outline"}
            onClick={() => onToolChange("eraser")}
            title="Eraser"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Brush Size:</span>
          <Input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
            className="w-24 h-8"
          />
          <span className="text-xs font-medium w-10">{brushSize}px</span>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Color:</span>
          <div className="flex gap-1">
            {predefinedColors.map((predefinedColor) => (
              <button
                key={predefinedColor.value}
                type="button"
                title={predefinedColor.label}
                className={cn(
                  "w-6 h-6 rounded-full border border-gray-300",
                  color === predefinedColor.value && "ring-2 ring-primary ring-offset-1"
                )}
                style={{ backgroundColor: predefinedColor.value }}
                onClick={() => onColorChange(predefinedColor.value)}
              />
            ))}
            <Input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-6 h-6 rounded-full overflow-hidden p-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
