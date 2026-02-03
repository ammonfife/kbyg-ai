import { useState } from "react";
import { Copy, FileDown, CheckCircle, Edit2, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { type Strategy } from "@/lib/mcp";
import { useToast } from "@/hooks/use-toast";

interface StrategyDisplayProps {
  strategy: Strategy;
  companyName: string;
  onUpdate?: (updatedStrategy: Strategy) => void;
}

export function StrategyDisplay({ strategy, companyName, onUpdate }: StrategyDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStrategy, setEditedStrategy] = useState<Strategy>(strategy);
  const { toast } = useToast();

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedStrategy);
    }
    setIsEditing(false);
    toast({ title: "Saved!", description: "Strategy updated successfully" });
  };

  const handleCancel = () => {
    setEditedStrategy(strategy);
    setIsEditing(false);
  };

  const updateListField = (field: 'key_topics' | 'talking_points' | 'what_to_avoid', value: string) => {
    const items = value.split('\n').map(s => s.trim()).filter(Boolean);
    setEditedStrategy(prev => ({ ...prev, [field]: items }));
  };

  const formatStrategyAsText = () => {
    const displayStrategy = isEditing ? editedStrategy : strategy;
    let text = `# GTM Strategy for ${companyName}\n\n`;
    text += `## Value Alignment\n${displayStrategy.value_alignment}\n\n`;
    text += `## Key Topics\n${displayStrategy.key_topics?.map(t => `- ${t}`).join('\n') || 'N/A'}\n\n`;
    text += `## Tone & Voice\n${displayStrategy.tone_and_voice}\n\n`;
    text += `## Product Positioning\n${displayStrategy.product_positioning}\n\n`;
    text += `## Talking Points\n${displayStrategy.talking_points?.map(t => `- ${t}`).join('\n') || 'N/A'}\n\n`;
    text += `## Opening Line\n${displayStrategy.opening_line}\n\n`;
    text += `## What to Avoid\n${displayStrategy.what_to_avoid?.map(t => `- ${t}`).join('\n') || 'N/A'}`;
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatStrategyAsText());
      setCopied(true);
      toast({ title: "Copied!", description: "Strategy copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to copy to clipboard", 
        variant: "destructive" 
      });
    }
  };

  const handleSaveAsPDF = () => {
    // Create a printable version and trigger print dialog
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>GTM Strategy - ${companyName}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
              h1 { color: #3B82F6; }
              h2 { color: #1F2937; margin-top: 24px; }
              ul { margin: 8px 0; padding-left: 24px; }
              li { margin: 4px 0; }
              p { line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>GTM Strategy for ${companyName}</h1>
            
            <h2>Value Alignment</h2>
            <p>${displayStrategy.value_alignment}</p>
            
            <h2>Key Topics</h2>
            <ul>${displayStrategy.key_topics?.map(t => `<li>${t}</li>`).join('') || '<li>N/A</li>'}</ul>
            
            <h2>Tone & Voice</h2>
            <p>${displayStrategy.tone_and_voice}</p>
            
            <h2>Product Positioning</h2>
            <p>${displayStrategy.product_positioning}</p>
            
            <h2>Talking Points</h2>
            <ul>${displayStrategy.talking_points?.map(t => `<li>${t}</li>`).join('') || '<li>N/A</li>'}</ul>
            
            <h2>Opening Line</h2>
            <p>"${displayStrategy.opening_line}"</p>
            
            <h2>What to Avoid</h2>
            <ul>${displayStrategy.what_to_avoid?.map(t => `<li>${t}</li>`).join('') || '<li>N/A</li>'}</ul>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const displayStrategy = isEditing ? editedStrategy : strategy;

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">
          GTM Strategy for {companyName}
          {isEditing && <Badge variant="outline" className="ml-2">Editing</Badge>}
        </CardTitle>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleSaveAsPDF}>
                <FileDown className="h-4 w-4" />
                Save as PDF
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="font-semibold text-primary mb-2">Value Alignment</h3>
          {isEditing ? (
            <Textarea
              value={editedStrategy.value_alignment}
              onChange={(e) => setEditedStrategy(prev => ({ ...prev, value_alignment: e.target.value }))}
              rows={3}
              className="text-sm"
            />
          ) : (
            <p className="text-sm">{displayStrategy.value_alignment || "N/A"}</p>
          )}
        </section>

        <Separator />

        <section>
          <h3 className="font-semibold text-primary mb-2">Key Topics</h3>
          {isEditing ? (
            <Textarea
              value={editedStrategy.key_topics?.join('\n') || ''}
              onChange={(e) => updateListField('key_topics', e.target.value)}
              placeholder="One topic per line"
              rows={4}
              className="text-sm font-mono"
            />
          ) : displayStrategy.key_topics && displayStrategy.key_topics.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {displayStrategy.key_topics.map((topic, idx) => (
                <li key={idx}>{topic}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No topics available</p>
          )}
        </section>

        <Separator />

        <section>
          <h3 className="font-semibold text-primary mb-2">Tone & Voice</h3>
          {isEditing ? (
            <Textarea
              value={editedStrategy.tone_and_voice}
              onChange={(e) => setEditedStrategy(prev => ({ ...prev, tone_and_voice: e.target.value }))}
              rows={3}
              className="text-sm"
            />
          ) : (
            <p className="text-sm">{displayStrategy.tone_and_voice || "N/A"}</p>
          )}
        </section>

        <Separator />

        <section>
          <h3 className="font-semibold text-primary mb-2">Product Positioning</h3>
          {isEditing ? (
            <Textarea
              value={editedStrategy.product_positioning}
              onChange={(e) => setEditedStrategy(prev => ({ ...prev, product_positioning: e.target.value }))}
              rows={3}
              className="text-sm"
            />
          ) : (
            <p className="text-sm">{displayStrategy.product_positioning || "N/A"}</p>
          )}
        </section>

        <Separator />

        <section>
          <h3 className="font-semibold text-primary mb-2">Talking Points</h3>
          {isEditing ? (
            <Textarea
              value={editedStrategy.talking_points?.join('\n') || ''}
              onChange={(e) => updateListField('talking_points', e.target.value)}
              placeholder="One point per line"
              rows={5}
              className="text-sm font-mono"
            />
          ) : displayStrategy.talking_points && displayStrategy.talking_points.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {displayStrategy.talking_points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No talking points available</p>
          )}
        </section>

        <Separator />

        <section>
          <h3 className="font-semibold text-primary mb-2">Opening Line</h3>
          {isEditing ? (
            <Input
              value={editedStrategy.opening_line}
              onChange={(e) => setEditedStrategy(prev => ({ ...prev, opening_line: e.target.value }))}
              className="text-sm"
            />
          ) : (
            <p className="text-sm italic">"{displayStrategy.opening_line || "N/A"}"</p>
          )}
        </section>

        <Separator />

        <section>
          <h3 className="font-semibold text-primary mb-2">What to Avoid</h3>
          {isEditing ? (
            <Textarea
              value={editedStrategy.what_to_avoid?.join('\n') || ''}
              onChange={(e) => updateListField('what_to_avoid', e.target.value)}
              placeholder="One item per line"
              rows={4}
              className="text-sm font-mono"
            />
          ) : displayStrategy.what_to_avoid && displayStrategy.what_to_avoid.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
              {displayStrategy.what_to_avoid.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No items to avoid listed</p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
