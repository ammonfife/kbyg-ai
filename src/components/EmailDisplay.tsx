import { useState } from "react";
import { Copy, Send, Save, CheckCircle, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type DraftedEmail } from "@/lib/mcp";
import { useToast } from "@/hooks/use-toast";

interface EmailDisplayProps {
  email: DraftedEmail;
  companyName: string;
}

export function EmailDisplay({ email, companyName }: EmailDisplayProps) {
  const [subject, setSubject] = useState(email.subject);
  const [body, setBody] = useState(email.body);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      const fullEmail = `Subject: ${subject}\n\n${body}`;
      await navigator.clipboard.writeText(fullEmail);
      setCopied(true);
      toast({ title: "Copied!", description: "Email copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to copy to clipboard", 
        variant: "destructive" 
      });
    }
  };

  const handleSendViaGmail = () => {
    const mailtoUrl = `mailto:${email.to || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleSaveDraft = () => {
    // Save to localStorage for now
    const drafts = JSON.parse(localStorage.getItem('email-drafts') || '[]');
    drafts.push({
      id: Date.now(),
      companyName,
      subject,
      body,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem('email-drafts', JSON.stringify(drafts));
    toast({ title: "Saved!", description: "Draft saved locally" });
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Email Draft for {companyName}
        </CardTitle>
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
          <Button variant="outline" size="sm" onClick={handleSendViaGmail}>
            <Send className="h-4 w-4" />
            Send via Gmail
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveDraft}>
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject Line</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="body">Email Body</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Email body..."
            rows={12}
            className="font-mono text-sm"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Tip: Edit the email above before copying or sending. Changes are not saved automatically.
        </p>
      </CardContent>
    </Card>
  );
}
