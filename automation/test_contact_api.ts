async function testContactApi(): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Antigravity TypeScript Migration',
                email: 'ts-test@antigravity.ai',
                phone: '1234567890',
                subject: 'TypeScript Verification',
                message: 'This is an automated TypeScript verification for the contact form microservice.'
            }),
        });

        const data = await response.json();
        console.log('API_RESPONSE:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('API_FAILED:', error);
    }
}

testContactApi();
