import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SharedLayout } from "@/components/shared-layout";
import { DrawingCanvas } from "@/components/ui/canvas";
import { DrawingToolBar } from "@/components/drawing-tool-bar";
import { HeartTemplates } from "@/components/heart-templates";
import { DrawingList } from "@/components/drawing-list";
import { Drawing } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [color, setColor] = useState<string>("#E91E63");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [canvasData, setCanvasData] = useState<string | null>(null);
  const [currentDrawingId, setCurrentDrawingId] = useState<number | null>(null);
  
  // Query for fetching drawings
  const { data: drawings = [], isLoading: isLoadingDrawings } = useQuery<Drawing[]>({
    queryKey: ["/api/drawings"],
  });

  // Mutation for saving drawings
  const saveMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const res = await apiRequest("POST", "/api/drawings", { imageData });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drawings"] });
      toast({
        title: "Drawing saved",
        description: "Your heart drawing has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving drawing",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSaveDrawing = () => {
    if (!canvasData) {
      toast({
        title: "Cannot save empty drawing",
        description: "Please draw something first.",
        variant: "destructive",
      });
      return;
    }
    
    saveMutation.mutate(canvasData);
  };

  const handleClearCanvas = () => {
    setCanvasData(null);
    setCurrentDrawingId(null);
    toast({
      title: "Canvas cleared",
      description: "The canvas has been cleared.",
    });
  };

  const handleSelectDrawing = (drawing: Drawing) => {
    setCanvasData(drawing.imageData);
    setCurrentDrawingId(drawing.id);
    toast({
      title: "Drawing loaded",
      description: "Your drawing has been loaded to the canvas.",
    });
  };

  const handleUseTemplate = (templateDataUrl: string) => {
    setCanvasData(templateDataUrl);
    setCurrentDrawingId(null);
    toast({
      title: "Template loaded",
      description: "The template has been loaded to the canvas.",
    });
  };

  return (
    <SharedLayout>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        {/* Main Canvas Area */}
        <div className="flex-grow flex flex-col md:order-2">
          <DrawingToolBar
            tool={tool}
            color={color}
            brushSize={brushSize}
            onToolChange={setTool}
            onColorChange={setColor}
            onBrushSizeChange={setBrushSize}
            onSave={handleSaveDrawing}
            onClear={handleClearCanvas}
            isSaving={saveMutation.isPending}
          />
          
          <div className="flex-grow flex items-center justify-center bg-neutral-light p-4">
            <div className="relative w-full max-w-2xl aspect-square rounded-lg shadow-md overflow-hidden">
              <DrawingCanvas
                tool={tool}
                color={color}
                brushSize={brushSize}
                canvasData={canvasData}
                onSave={setCanvasData}
                className="h-full"
              />
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-full md:w-72 lg:w-80 bg-white border-r border-gray-200 md:order-1 overflow-y-auto p-4 space-y-6">
          <HeartTemplates onSelectTemplate={handleUseTemplate} />
          
          {isLoadingDrawings ? (
            <div className="py-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-sm text-gray-500">Loading your drawings...</p>
            </div>
          ) : (
            <DrawingList 
              drawings={drawings} 
              onSelectDrawing={handleSelectDrawing} 
            />
          )}
        </div>
      </div>
    </SharedLayout>
  );
}
