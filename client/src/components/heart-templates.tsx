import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

// Define heart templates data
const HEART_TEMPLATES = [
  {
    id: 1,
    name: "Simple Heart",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M50 90c-1.5 0-3-.5-4.2-1.5C35.3 80.3 10 59.5 10 35c0-18.2 14.8-33 33-33s33 14.8 33 33c0 24.5-25.3 45.3-35.8 53.5-1.2 1-2.7 1.5-4.2 1.5z' fill='%23E91E63'/%3E%3C/svg%3E",
    dataUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 100 100'%3E%3Cpath d='M50 90c-1.5 0-3-.5-4.2-1.5C35.3 80.3 10 59.5 10 35c0-18.2 14.8-33 33-33s33 14.8 33 33c0 24.5-25.3 45.3-35.8 53.5-1.2 1-2.7 1.5-4.2 1.5z' fill='%23E91E63'/%3E%3C/svg%3E"
  },
  {
    id: 2,
    name: "Decorative Heart",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M50 90c-1.5 0-3-.5-4.2-1.5C35.3 80.3 10 59.5 10 35c0-18.2 14.8-33 33-33s33 14.8 33 33c0 24.5-25.3 45.3-35.8 53.5-1.2 1-2.7 1.5-4.2 1.5z' fill='%23F48FB1' stroke='%23E91E63' stroke-width='2'/%3E%3Ccircle cx='30' cy='30' r='3' fill='%23FFFFFF'/%3E%3Ccircle cx='70' cy='30' r='3' fill='%23FFFFFF'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23FFFFFF'/%3E%3C/svg%3E",
    dataUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 100 100'%3E%3Cpath d='M50 90c-1.5 0-3-.5-4.2-1.5C35.3 80.3 10 59.5 10 35c0-18.2 14.8-33 33-33s33 14.8 33 33c0 24.5-25.3 45.3-35.8 53.5-1.2 1-2.7 1.5-4.2 1.5z' fill='%23F48FB1' stroke='%23E91E63' stroke-width='2'/%3E%3Ccircle cx='30' cy='30' r='3' fill='%23FFFFFF'/%3E%3Ccircle cx='70' cy='30' r='3' fill='%23FFFFFF'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23FFFFFF'/%3E%3C/svg%3E"
  },
  {
    id: 3,
    name: "3D Heart",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M50 90c-1.5 0-3-.5-4.2-1.5C35.3 80.3 10 59.5 10 35c0-18.2 14.8-33 33-33s33 14.8 33 33c0 24.5-25.3 45.3-35.8 53.5-1.2 1-2.7 1.5-4.2 1.5z' fill='%23C2185B' stroke='%23E91E63' stroke-width='4'/%3E%3Cpath d='M50 85c-1.5 0-3-.5-4.2-1.5C35.3 75.3 15 59.5 15 35c0-13.2 9.8-23 23-23' fill='none' stroke='%23F8BBD0' stroke-width='2'/%3E%3C/svg%3E",
    dataUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 100 100'%3E%3Cpath d='M50 90c-1.5 0-3-.5-4.2-1.5C35.3 80.3 10 59.5 10 35c0-18.2 14.8-33 33-33s33 14.8 33 33c0 24.5-25.3 45.3-35.8 53.5-1.2 1-2.7 1.5-4.2 1.5z' fill='%23C2185B' stroke='%23E91E63' stroke-width='4'/%3E%3Cpath d='M50 85c-1.5 0-3-.5-4.2-1.5C35.3 75.3 15 59.5 15 35c0-13.2 9.8-23 23-23' fill='none' stroke='%23F8BBD0' stroke-width='2'/%3E%3C/svg%3E"
  }
];

interface HeartTemplatesProps {
  onSelectTemplate: (templateDataUrl: string) => void;
}

export function HeartTemplates({ onSelectTemplate }: HeartTemplatesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Templates</CardTitle>
        <CardDescription className="text-xs">
          Select a template to start drawing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {HEART_TEMPLATES.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              className="h-auto p-0 aspect-square border border-gray-200 hover:border-primary transition duration-200 overflow-hidden"
              onClick={() => onSelectTemplate(template.dataUrl)}
              title={template.name}
            >
              <img 
                src={template.imageUrl} 
                alt={template.name} 
                className="w-full h-full object-cover" 
              />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
