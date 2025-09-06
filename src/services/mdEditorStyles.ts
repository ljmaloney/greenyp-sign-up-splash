export const mdEditorStyles = `
  .w-md-editor .w-md-editor-toolbar {
    height: 48px !important;
    background: #f3f4f6 !important;
    border-bottom: 1px solid #cbd5e0 !important;
    padding: 8px 12px !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  }

  .w-md-editor .w-md-editor-toolbar ul li button {
    height: 24px !important;
    width: 24px !important;
    background: #ffffff !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 6px !important;
    margin: 0 2px !important;
    color: #4a5568 !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
    transition: all 0.2s ease !important;
  }

  .w-md-editor .w-md-editor-toolbar ul li button:hover {
    background: #22c55e !important;
    color: white !important;
    border-color: #16a34a !important;
    box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2) !important;
    transform: translateY(-1px) !important;
  }

  .w-md-editor .w-md-editor-toolbar ul li button.active {
    background: #16a34a !important;
    color: white !important;
    border-color: #15803d !important;
  }

  .w-md-editor .w-md-editor-toolbar ul li.divider {
    height: 24px !important;
    margin: 4px 6px !important;
    border-left: 1px solid #cbd5e0 !important;
  }
`;

export const htmlToMarkdown = (html: string | null | undefined): string => {
    if (!html) return '';
    return html
        .replace(/<br\s*\/?>/gi, '\n')  // convert <br> or <br/> to \n
        .replace(/&nbsp;/gi, ' ')       // optional: decode non-breaking spaces
        .replace(/&lt;/gi, '<')         // decode HTML entities
        .replace(/&gt;/gi, '>')
        .replace(/&amp;/gi, '&')
        .trim();
};

const cleanTextBox = (text: string | null | undefined): string => {
    if (!text) return '';
    return text
        .replace(/"/g, '')
        .replace(/[\u2013\u2014]/g, "-")// Remove all double quotes
        .replace(/[\u0000-\u001F]/g, c => c === '\n' ? '\n' : '') // Remove control characters
        .replace(/[ \t]+/g, ' ') // Multiple spaces to single space
        .trim();
};