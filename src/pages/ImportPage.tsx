import { Download, Chrome, CheckCircle, ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ImportPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Download className="h-8 w-8 text-primary" />
          Import Data
        </h1>
        <p className="text-muted-foreground">
          Import company and contact data into GTM Intelligence Hub
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chrome Extension */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Chrome className="h-5 w-5" />
                Chrome Extension
              </CardTitle>
              <Badge variant="secondary">Recommended</Badge>
            </div>
            <CardDescription>
              Capture leads directly from LinkedIn and conference websites
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">One-Click Capture</p>
                  <p className="text-sm text-muted-foreground">
                    Save contacts and companies while browsing LinkedIn
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Auto-Sync</p>
                  <p className="text-sm text-muted-foreground">
                    Data automatically syncs to your GTM Hub
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Conference Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Bulk import attendees from event pages
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">Installation Steps</h4>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                    1
                  </span>
                  <span>Click the download button below to get the extension ZIP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                    2
                  </span>
                  <span>Extract the ZIP file to a folder on your computer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                    3
                  </span>
                  <span>Open Chrome → Extensions → Enable Developer Mode</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                    4
                  </span>
                  <span>Click "Load unpacked" and select the extracted folder</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                    5
                  </span>
                  <span>Pin the extension and start capturing leads!</span>
                </li>
              </ol>
            </div>

            <Button 
              className="w-full" 
              asChild
            >
              <a 
                href="https://github.com/ammonfife/kbyg-ai/archive/refs/heads/main.zip"
                download="gtm-chrome-extension.zip"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Extension ZIP
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Manual Import */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Import</CardTitle>
            <CardDescription>
              Import data via CSV or API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border-2 border-dashed rounded-lg text-center">
              <Download className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-medium">CSV Upload</p>
              <p className="text-sm text-muted-foreground mb-3">
                Drag & drop or click to upload a CSV file
              </p>
              <Button variant="outline" size="sm" disabled>
                Select File
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Coming soon
              </p>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">API Integration</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Connect your CRM or other data sources via our REST API
              </p>
              <Button variant="outline" className="w-full" disabled>
                <ExternalLink className="h-4 w-4 mr-2" />
                View API Docs (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Imports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Imports</CardTitle>
          <CardDescription>
            Data imported in the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent imports</p>
            <p className="text-sm">
              Install the Chrome extension or use CSV upload to import data
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
