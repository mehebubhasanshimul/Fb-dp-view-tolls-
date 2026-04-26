const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// UI এবং লজিক একসাথে
function getHTML(picUrl, userId, error = '') {
    return `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FB DP VIEWER | PRO VERSION</title>
        <style>
            :root { --primary: #00ff41; --bg: #0a0a0a; --card: #151515; }
            * { margin:0; padding:0; box-sizing:border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, sans-serif; 
                background-color: var(--bg); 
                color: white; 
                min-height: 100vh; 
                display: flex; justify-content: center; align-items: center; padding: 20px;
            }
            .container { 
                background: var(--card); 
                border: 1px solid var(--primary); 
                box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
                border-radius: 15px; padding: 40px; width: 100%; max-width: 500px; text-align: center;
            }
            h1 { color: var(--primary); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; font-size: 22px; }
            p.tag { color: #888; font-size: 12px; margin-bottom: 25px; }
            input { 
                width: 100%; padding: 15px; background: #222; border: 1px solid #444; 
                border-radius: 8px; color: white; font-size: 16px; outline: none; margin-bottom: 15px;
                transition: 0.3s;
            }
            input:focus { border-color: var(--primary); box-shadow: 0 0 10px rgba(0, 255, 65, 0.3); }
            button { 
                width: 100%; padding: 15px; background: var(--primary); color: black; 
                border: none; border-radius: 8px; font-weight: bold; font-size: 16px; 
                cursor: pointer; text-transform: uppercase; transition: 0.3s;
            }
            button:hover { background: #00cc33; transform: translateY(-2px); }
            .error { color: #ff4444; margin: 15px 0; font-size: 14px; }
            .result { margin-top: 30px; animation: fadeIn 0.5s ease; }
            .result img { 
                width: 100%; max-width: 250px; border-radius: 12px; 
                border: 3px solid var(--primary); box-shadow: 0 0 15px rgba(0, 255, 65, 0.4);
            }
            .info { margin-top: 15px; color: var(--primary); font-family: monospace; }
            .download-link { 
                display: inline-block; margin-top: 20px; padding: 10px 20px; 
                border: 1px solid var(--primary); color: var(--primary); 
                text-decoration: none; border-radius: 5px; font-size: 14px;
            }
            .download-link:hover { background: var(--primary); color: black; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>FB DP VIEWER</h1>
            <p class="tag">SECURE ACCESS • VERSION 2.0</p>
            <form method="POST">
                <input type="text" name="fb_link" placeholder="Profile Link or Username" required>
                <button type="submit">Fetch Data</button>
            </form>
            ${error ? `<p class="error">${error}</p>` : ''}
            ${picUrl ? `
                <div class="result">
                    <img src="${picUrl}" alt="Profile Picture" referrerpolicy="no-referrer">
                    <div class="info">TARGET: ${userId}</div>
                    <a href="${picUrl}" class="download-link" target="_blank">View Full Image</a>
                </div>
            ` : ''}
        </div>
    </body>
    </html>`;
}

app.get('/', (req, res) => res.send(getHTML('', '')));

app.post('/', (req, res) => {
    let fbLink = req.body.fb_link.trim();
    let userId = '';

    // Advanced Regex to extract Username/ID
    const match = fbLink.match(/(?:https?:\/\/)?(?:www\.)?(?:facebook|fb)\.com\/([a-zA-Z0-9\.]+)/);
    if (match) {
        userId = match[1].split('/')[0].replace('profile.php?id=', '');
    } else {
        userId = fbLink;
    }

    if (userId) {
        // Redirect URL which works without Access Token
        const picUrl = `https://www.facebook.com/${userId}/picture?type=large&width=1000&height=1000`;
        res.send(getHTML(picUrl, userId));
    } else {
        res.send(getHTML('', '', 'Invalid Username or Link!'));
    }
});

app.listen(port, () => console.log(`Server started at port ${port}`));
