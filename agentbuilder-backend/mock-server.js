const http = require('http');
const url = require('url');

const hostname = 'localhost';
const port = 7071;

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/api/RegisterClient' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                console.log('Registration data received:', data);
                
                // Simulate successful registration
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'Client registered successfully (mock response)',
                    data: data
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else if (pathname === '/api/GenerateDemo' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                console.log('Demo generation data received:', data);
                
                // Simulate demo generation
                const mockDemo = {
                    prompt: `Mock prompt template for ${data.product}`,
                    demo: `This is a mock demo for ${data.product} product with the following configuration: ${JSON.stringify(data.formData, null, 2)}`
                };
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(mockDemo));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(port, hostname, () => {
    console.log(`Mock Azure Functions server running at http://${hostname}:${port}/`);
    console.log('Available endpoints:');
    console.log('- POST http://localhost:7071/api/RegisterClient');
    console.log('- POST http://localhost:7071/api/GenerateDemo');
});
