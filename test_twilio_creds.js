import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

console.log('Testing Twilio Credentials...');
console.log('SID:', accountSid);
console.log('Service ID:', serviceSid);

const client = twilio(accountSid, authToken);

try {
    const service = await client.verify.v2.services(serviceSid).fetch();
    console.log('✅ Success! Twilio Service Found:', service.friendlyName);
} catch (err) {
    console.log('❌ Twilio Error:', err.message);
    if (err.message.includes('Authenticate')) {
        console.log('👉 Tip: Your SID or Auth Token is incorrect.');
    }
}
