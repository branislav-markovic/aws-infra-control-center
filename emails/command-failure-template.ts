const escapeHtml = (s?: string) => {
	return s == null
		? ""
		: String(s)
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#39;");
};

export const renderCommandFailureEmail = (data: {
	message: string;
	instanceId: string;
	errors?: string;
}) => {
	return `
    <!doctype html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>AWS Command Failure Notification</title>
        <style>
        body { font-family: Arial, sans-serif; line-height: 1.4 }
        pre { background:#f6f8fa; padding:8px; border-radius:4px; }
        </style>
    </head>
    <body>
        <h2>AWS Command Failure</h2>
        <p>${escapeHtml(data.message)}</p>
        <p><strong>Instance ID:</strong> ${escapeHtml(data.instanceId)}</p>
        ${data.errors ? `<h3>Errors</h3><pre>${escapeHtml(data.errors)}</pre>` : ""}
    </body>
    </html>
    `;
};
