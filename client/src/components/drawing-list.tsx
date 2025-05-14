import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Drawing } from "@shared/schema";
import { format } from "date-fns";

interface DrawingListProps {
  drawings: Drawing[];
  onSelectDrawing: (drawing: Drawing) => void;
}

export function DrawingList({ drawings, onSelectDrawing }: DrawingListProps) {
  const { toast } = useToast();
  const [selectedDrawingId, setSelectedDrawingId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/drawings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drawings"] });
      toast({
        title: "Drawing deleted",
        description: "Your drawing has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting drawing",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setShowDeleteDialog(false);
      setSelectedDrawingId(null);
    }
  });

  const handleDeleteClick = (id: number) => {
    setSelectedDrawingId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedDrawingId !== null) {
      deleteMutation.mutate(selectedDrawingId);
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">My Hearts</CardTitle>
        </CardHeader>
        <CardContent>
          {drawings.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <div className="text-primary text-3xl mb-2">❤</div>
              <p className="text-sm">
                No saved hearts yet.<br />
                Create and save your first heart!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {drawings.map((drawing) => (
                <div 
                  key={drawing.id} 
                  className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="aspect-video w-full bg-white relative">
                    <img
                      src={drawing.imageData}
                      alt={`Drawing created on ${formatDate(drawing.createdAt)}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-2 flex items-center justify-between">
                    <span className="text-xs text-gray-700">
                      {formatDate(drawing.createdAt)}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onSelectDrawing(drawing)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => handleDeleteClick(drawing.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your heart drawing.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
