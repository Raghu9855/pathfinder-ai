export function extractJSON(text) {
    text = text.replace(/```json|```/g, '').trim(); // Remove backticks

    try {
        return JSON.parse(text); // Try parsing directly
    } catch (err) {
        // Try to extract first JSON object if extra text exists
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch (err2) {
                return null;
            }
        }
        return null;
    }
}
