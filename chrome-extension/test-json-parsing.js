// Test JSON parsing fixes for background.js
// Run with: node test-json-parsing.js

// Simulate the problematic response from Gemini
const problematicResponse = `\`\`\`json
{
  "eventName": "CES 2026",
  "date": "January 6-9, 2026",
  "startDate": "2026-01-06",
  "endDate": "2026-01-09",
  "location": "Las Vegas, NV",
  "description": "The world's most influential technology event",
  "estimatedAttendees": 135000,
  "expectedPersonas": [
    {
      "persona": "Founder",
      "likelihood": "High",
      "count": "Many",
      "linkedinMessage": "Hi! Saw your startup at CES 2026",
      "iceBreaker": "I saw your booth—the tech looks incredible",
      "conversationStarters": [
        "What's been the biggest challenge in scaling?",
        "Are you using any AI-driven models?",
        "Most agencies just look at ROAS"
      ],
      "keywords": ["test"]
    }
  ]
}
\`\`\``;

// Function to clean JSON (matching the fixed code)
function cleanJsonResponse(textContent) {
  let jsonStr = textContent.trim();
  
  // Try to extract JSON from markdown code blocks
  let jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  } else {
    // Pattern 2: Any markdown code blocks
    jsonMatch = jsonStr.match(/```\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    } else {
      // Pattern 3: Try to find JSON object directly
      const jsonObjectMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        jsonStr = jsonObjectMatch[0];
      }
    }
  }
  
  // Final cleanup: aggressively remove any remaining markdown code fences
  jsonStr = jsonStr.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
  
  // Ensure we start with a brace
  if (!jsonStr.startsWith('{') && !jsonStr.startsWith('[')) {
    const braceIndex = jsonStr.indexOf('{');
    if (braceIndex > 0) {
      jsonStr = jsonStr.substring(braceIndex);
    }
  }
  
  return jsonStr;
}

// Test cases
console.log('Testing JSON parsing fixes...\n');

// Test 1: Response with markdown code blocks
console.log('Test 1: Markdown code block with json tag');
try {
  const cleaned = cleanJsonResponse(problematicResponse);
  console.log('✓ Cleaned successfully');
  console.log('First 100 chars:', cleaned.substring(0, 100));
  const parsed = JSON.parse(cleaned);
  console.log('✓ Parsed successfully');
  console.log('Event name:', parsed.eventName);
  console.log('Attendees:', parsed.estimatedAttendees);
  console.log('');
} catch (error) {
  console.error('✗ Failed:', error.message);
  console.log('');
}

// Test 2: Plain JSON without markdown
console.log('Test 2: Plain JSON without markdown');
const plainJson = '{"eventName": "Test Event", "date": "2026-01-01"}';
try {
  const cleaned = cleanJsonResponse(plainJson);
  const parsed = JSON.parse(cleaned);
  console.log('✓ Parsed successfully');
  console.log('Event name:', parsed.eventName);
  console.log('');
} catch (error) {
  console.error('✗ Failed:', error.message);
  console.log('');
}

// Test 3: JSON with extra text before
console.log('Test 3: JSON with extra text before');
const textBefore = 'Here is the result: {"eventName": "Test", "date": "2026"}';
try {
  const cleaned = cleanJsonResponse(textBefore);
  const parsed = JSON.parse(cleaned);
  console.log('✓ Parsed successfully');
  console.log('Event name:', parsed.eventName);
  console.log('');
} catch (error) {
  console.error('✗ Failed:', error.message);
  console.log('');
}

// Test 4: Markdown without json tag
console.log('Test 4: Markdown code block without json tag');
const noJsonTag = '```\n{"eventName": "Test Event"}\n```';
try {
  const cleaned = cleanJsonResponse(noJsonTag);
  const parsed = JSON.parse(cleaned);
  console.log('✓ Parsed successfully');
  console.log('Event name:', parsed.eventName);
  console.log('');
} catch (error) {
  console.error('✗ Failed:', error.message);
  console.log('');
}

console.log('All tests completed!');
