const express = require('express');
const axios = require('axios'); // ইমেজ প্রক্সি করার জন্য লাগবে
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

function getHTML(picUrl, userId, error = '') {
    return `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FB DP VIEWER | PRO</title>
        <style>
            :root { --primary: #00ff41; --bg: #0a0a0a; --card: #151515; }
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family: 'Segoe UI', sans-serif; background: var(--bg); color: white; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; }
            .container { background: var(--card); border: 1px solid var(--primary); border-radius: 15px; padding: 30px; width: 100%; max-width: 450px; text-align: center; }
            h1 { color: var(--primary); letter-spacing: 2px; margin-bottom: 20px; font-size: 22px; }
            input { width: 100%; padding: 12px; background: #222; border: 1px solid #444; border-radius: 8px; color: white; margin-bottom: 15px; outline: none; }
            button { width: 100%; padding: 12px; background: var(--primary); color: black; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; }
            button:hover { background: #00cc33; }
            .result { margin-top: 25px; }
            .result img { width: 100%; border-radius: 10px; border: 2px solid var(--primary); box-shadow: 0 0 15px rgba(0, 255, 65, 0.3); }
            .download-btn { display: inline-block; margin-top: 15px; padding: 10px 20px; background: transparent; border: 1px solid var(--primary); color: var(--primary); text-decoration: none; border-radius: 5px; transition: 0.3s; }
            .download-btn:hover { background: var(--primary); color: black; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>FB DP VIEWER</h1>
            <form method="POST">
                <input type="text" name="fb_link" placeholder="Profile Link or Username" required>
                <button type="submit">Fetch Image</button>
            </form>
            ${picUrl ? `
                <div class="result">
                    <img src="${picUrl}" alt="DP">
                    <br>
                    <a href="${picUrl}" class="download-btn" target="_blank" download="profile.jpg">Download Image</a>
                </div>
            ` : ''}
        </div>
    </body>
    </html>`;
}

// ইমেজ প্রক্সি রুট (এটি ইমেজকে নট ফাউন্ড হওয়া থেকে বাঁচাবে)
app.get('/proxy-image', async (req, res) => {
    const imageUrl = req.query.url;
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        res.set('Content-Type', 'image/jpeg');
        res.send(response.data);
    } catch (e) {
        res.status(404).send('Image Not Found');
    }
});

app.get('/', (req, res) => res.send(getHTML('', '')));

app.post('/', (req, res) => {
    let fbLink = req.body.fb_link.trim();
    let userId = fbLink.includes('facebook.com') ? fbLink.split('/').pop() : fbLink;
    
    if (userId) {
        // প্রক্সি ইউআরএল তৈরি করা হচ্ছে
        const targetUrl = `https://www.facebook.com/${userId}/picture?type=large&width=800&height=800`;
        const proxyUrl = `/proxy-image?url=${encodeURIComponent(targetUrl)}`;
        res.send(getHTML(proxyUrl, userId));
    }
});

app.listen(port);
