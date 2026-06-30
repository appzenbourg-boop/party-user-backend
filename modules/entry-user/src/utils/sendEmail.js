import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (options) => {
    try {
        // The URL of your deployed Next.js frontend, or localhost during development
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        
        // This secret must match the one used in Next.js /api/send-email/route.ts
        const secret = process.env.EMAIL_API_SECRET || 'entry_club_secure_api_secret_2026';

        console.log(`[FRONTEND-SMTP] ====== INITIATING EMAIL SEND ======`);
        console.log(`[FRONTEND-SMTP] Target Frontend URL: ${frontendUrl}`);
        console.log(`[FRONTEND-SMTP] Is FRONTEND_URL environment variable set? : ${!!process.env.FRONTEND_URL}`);

        // Call the Next.js API to send the email (Server-to-Server)
        const response = await fetch(`${frontendUrl}/api/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...options,
                secret
            })
        });

        const data = await response.json();
        
        if (!response.ok || !data.success) {
            console.error('[FRONTEND-SMTP] API returned error:', data);
            throw new Error(data.error || 'Failed to send email via frontend API');
        }

        console.log('[FRONTEND-SMTP] Email sent successfully via frontend API:', data.messageId);
        return data;

    } catch (err) {
        console.error('[FRONTEND-SMTP] Delivery failed:', err.message);
        throw err;
    }
};

export default sendEmail;
