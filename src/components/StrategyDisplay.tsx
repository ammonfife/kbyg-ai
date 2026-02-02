import { useState } from "react";
import { Copy, FileDown, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type Strategy } from "@/lib/mcp";
import { useToast } from "@/hooks/use-toast";

interface StrategyDisplayProps {
  strategy: Strategy;
  companyName: string;
}

export function StrategyDisplay({ strategy, companyName }: StrategyDisplayProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const formatStrategyAsText = () => {
    let text = `# GTM Strategy for ${companyName}\n\n`;
    text += `## Value Alignment\n${strategy.value_alignment}\n\n`;
    text += `## Key Topics\n${strategy.key_topics?.map(t => `- ${t}`).join('\n') || 'N/A'}\n\n`;
    text += `## Tone & Voice\n${strategy.tone_and_voice}\n\n`;
    text += `## Product Positioning\n${strategy.product_positioning}\n\n`;
    text += `## Talking Points\n${strategy.talking_points?.map(t => `- ${t}`).join('\n') || 'N/A'}\n\n`;
    text += `## Opening Line\n${strategy.opening_line}\n\n`;
    text += `## What to Avoid\n${strategy.what_to_avoid?.map(t => `- ${t}`).join('\n') || 'N/A'}`;
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
    const printContent = formatStrategyAsText();
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
            <p>${strategy.value_alignment}</p>
            
            <h2>Key Topics</h2>
            <ul>${strategy.key_topics?.map(t => `<li>${t}</li>`).join('') || '<li>N/A</li>'}</ul>
            
            <h2>Tone & Voice</h2>
            <p>${strategy.tone_and_voice}</p>
            
            <h2>Product Positioning</h2>
            <p>${strategy.product_positioning}</p>
            
            <h2>Talking Points</h2>
            <ul>${strategy.talking_points?.map(t => `<li>${t}</li>`).join('') || '<li>N/A</li>'}</ul>
            
            <h2>Opening Line</h2>
            <p>"${strategy.opening_line}"</p>
            
            <h2>What to Avoid</h2>
            <ul>${strategy.what_to_avoid?.map(t => `<li>${t}</li>`).join('') || '<li>N/A</li>'}</ul>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">GTM Strategy for {companyName}</CardTitle>
        <div className="flex gap-2">
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
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="font-semibold text-primary mb-2">Value Alignment</h3>
          <p className="text-sm">{strategy.value_alignment || "N/A"}</p>
        </section>

        <Separator />

        <section>
          <h3 className="font-semibold text-primary mb-2">Key Topics</h3>
          {strategy.key_topics && strategy.key_topics.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {strategy.key_topics.map((topic, idx) => (
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
          <p className="text-sm">{strategy.tone_and_voice || "N/A"}</p>
        </section>

        <Separator />

        <section>
          <h3 className="font-semibold text-primary mb-2">Product Positioning</h3>
          <p className="text-sm">{strategy.product_positioning || "N/A"}</p>
        </section>

        <Separator />

        <section>
          <h3 className="font-semibold text-primary mb-2">Talking Points</h3>
          {strategy.talking_points && strategy.talking_points.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {strategy.talking_points.map((point, idx) => (
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
          <p className="text-sm italic">"{strategy.opening_line || "N/A"}"</p>
        </section>

        <Separator />

        <section>
          <h3 className="font-semibold text-primary mb-2">What to Avoid</h3>
          {strategy.what_to_avoid && strategy.what_to_avoid.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
              {strategy.what_to_avoid.map((item, idx) => (
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
