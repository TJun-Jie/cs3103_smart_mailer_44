// app/actions/sendEmails.js
"use server";

export async function sendEmails(formData) {
    try {
        const response = await fetch(`${process.env.API_URL}/send-emails`, {
            method: "POST",
            body: formData,
            // Don't need to specify headers as FormData sets them automatically
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to send emails");
        }

        const data = await response.json();

        // Calculate total emails sent
        const totalSent = Object.values(data.sentCount).reduce(
            (a, b) => a + b,
            0
        );

        return {
            success: true,
            message: `Successfully sent ${totalSent} emails${
                data.errors ? ` (${data.errors.length} failures)` : ""
            }`,
            sentCount: data.sentCount,
            errors: data.errors,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Failed to send emails",
        };
    }
}
