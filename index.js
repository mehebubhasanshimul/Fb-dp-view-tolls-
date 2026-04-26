const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(getHTML('', ''));
});

app.post('/', (req, res) => {
    const fbLink = req.body.fb_link.trim();
    let userId = '';

    // Extracting Username or ID from Link
    const match = fbLink.match(/facebook\.com\/([a-zA-Z0-9\.]+)/);
    if (match) {
        userId = match[1];
    } else if (/^[a-zA-Z0-9\.]+$/.test(fbLink)) {
        userId = fbLink;
    }

    if (userId) {
        const picUrl = `https://graph.facebook.com/${userId}/picture?type=large&width=720&height=720`;
        res.send(getHTML(picUrl, userId));
    } else {
        res.send(getHTML('', '', 'সঠিক ফেসবুক লিংক বা ইউজারনেম দিন!'));
    }
});

function getHTML(picUrl, userId, error = '') {
    return `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facebook DP Viewer | Node.js</title>
        <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family: 'Segoe UI', sans-serif; background: #f0f2f5; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; }
            .container { background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px; width: 100%; max-width: 500px; text-align: center; }
            h1 { color: #1877f2; margin-bottom: 20px; }
            input { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; margin-bottom: 10px; font-size: 16px; outline: none; }
            button { width: 100%; padding: 12px; background: #1877f2; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
            .error { color: red; margin-bottom: 10px; }
            .result img { width: 100%; max-width: 300px; border-radius: 10px; border: 5px solid #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.2); margin-top: 15px; }
            .download-btn { display: inline-block; margin-top: 15px; padding: 10px 20px; background: #42b72a; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>FB DP Viewer</h1>
            <form method="POST">
                <input type="text" name="fb_link" placeholder="Username বা Profile Link দিন..." required>
                <button type="submit">ছবি দেখুন</button>
            </form>
            ${error ? `<p class="error">${error}</p>` : ''}
            ${picUrl ? `
                <div class="result">
                    <p>ইউজারনেম: <strong>${userId}</strong></p>
                    <img src="${picUrl}" alt="Profile Picture">
                    <br>
                    <a href="${picUrl}" class="download-btn" target="_blank">ছবিটি সেভ করুন</a>
                </div>
            ` : ''}
        </div>
    </body>
    </html>`;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
