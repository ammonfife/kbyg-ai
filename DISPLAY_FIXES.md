# Display Fixes - "No title" Issue

## Problem
People/contacts showing "No title @ Company" when title field is empty.

## Fixes Applied

### 1. Backend Sync - Filter Empty Titles
**File:** `chrome-extension/backend-sync.js`

**Changed:**
- Filter out people with no name
- Convert empty titles to `null` instead of empty string
- Cleaner data in database

**Before:**
```javascript
title: person.title,
```

**After:**
```javascript
title: person.title && person.title.trim() ? person.title : null,
```

### 2. Company Detail Display
**File:** `src/components/CompanyDetail.tsx`

**Changed:**
- Show "Contact" instead of empty title
- Better formatting: "Title @ Company" or "Contact @ Company"

**Before:**
```jsx
{employee.title && (
  <p className="text-sm text-muted-foreground">{employee.title}</p>
)}
```

**After:**
```jsx
<p className="text-sm text-muted-foreground">
  {employee.title || 'Contact'} {employee.company ? `@ ${employee.company}` : ''}
</p>
```

## Recommended: Add People/Contacts Page

Since "Recent Contacts" suggests viewing people across all companies, add a dedicated contacts page:

### Create `src/pages/ContactsPage.tsx`

```tsx
import { useState, useEffect } from "react";
import { Users, Search, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function ContactsPage() {
  const { user } = useAuth();
  const [people, setPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPeople();
    }
  }, [user]);

  const loadPeople = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('people')
        .select(`
          *,
          events (
            event_name,
            date
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setPeople(data);
      }
    } catch (err) {
      console.error('Error loading people:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPeople = searchQuery
    ? people.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.company?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : people;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Contacts
        </h1>
        <p className="text-muted-foreground">
          Individuals across your target companies
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts by name, title, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{people.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Target Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {people.filter(p => p.is_target).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(people.map(p => p.company)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contacts</CardTitle>
          <CardDescription>
            {filteredPeople.length} {filteredPeople.length === 1 ? 'contact' : 'contacts'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPeople.map((person) => (
              <div 
                key={person.id}
                className="flex items-start justify-between p-4 rounded-lg hover:bg-muted/50"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{person.name}</p>
                    {person.is_target && (
                      <Badge variant="default">🎯 Target</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {person.title || 'Contact'} 
                    {person.company && ` @ ${person.company}`}
                  </p>
                  {person.events && (
                    <p className="text-xs text-muted-foreground">
                      From: {person.events.event_name}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {person.linkedin && (
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      LinkedIn →
                    </a>
                  )}
                  {person.persona && (
                    <Badge variant="outline" className="text-xs">
                      {person.persona}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {filteredPeople.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                {searchQuery ? 'No contacts match your search' : 'No contacts yet'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Add to Routes

In `App.tsx`:

```tsx
import ContactsPage from "@/pages/ContactsPage";

// Add route:
<Route path="/contacts" element={<ProtectedRoute><ContactsPage /></ProtectedRoute>} />
```

### Add to Sidebar

In `src/components/AppSidebar.tsx`:

```tsx
import { Users } from "lucide-react";

// Add to navItems:
{ to: "/contacts", icon: Users, label: "Contacts" },
```

## Summary

**Fixed:**
✅ Backend sync filters empty titles
✅ Display shows "Contact" instead of empty title
✅ Better formatting with company name

**Recommended:**
📝 Add dedicated Contacts page to view all people across events
📝 Add search/filter by title, company, target status
📝 Show which event each contact came from

---

**Status:** Display logic improved, dedicated page recommended
