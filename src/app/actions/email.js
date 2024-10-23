// app/actions/sendEmails.js
"use server";

export async function sendEmails(formData) {
    try {
        const response = await fetch(`${process.env.API_URL}/api/send-emails`, {
            method: "POST",
            body: formData,
            // Don't need to specify headers as FormData sets them automatically
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to send emails");
        }

        const data = await response.json();

        return {
            success: true,
            message: data.message || `Emails sent to ${data.total} recipients`,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Failed to send emails",
        };
    }
}
