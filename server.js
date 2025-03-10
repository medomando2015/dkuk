const express = require("express");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");

const app = express();
app.use(cors());

// إعدادات Telegram
const TELEGRAM_BOT_TOKEN = "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11";  // ضع التوكن الخاص بك هنا
const TELEGRAM_CHAT_ID = "123456789";  // ضع معرفك هنا

app.get("/", async (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const port = req.socket.remotePort;
    const timestamp = new Date().toISOString();

    // البيانات التي سيتم إرسالها
    const visitorData = { ip, port, timestamp };

    // حفظ البيانات في ملف
    fs.readFile("logs.json", (err, data) => {
        let logs = [];
        if (!err) logs = JSON.parse(data);
        logs.push(visitorData);

        fs.writeFile("logs.json", JSON.stringify(logs, null, 2), (err) => {
            if (err) console.error("❌ خطأ في التخزين:", err);
        });
    });

    // إرسال البيانات إلى Telegram
    const message = `🚀 زائر جديد:\n🔹 IP: ${ip}\n🔹 Port: ${port}\n📅 Time: ${timestamp}`;
    const telegramURL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
        await axios.post(telegramURL, { chat_id: TELEGRAM_CHAT_ID, text: message });
        console.log("✅ تم إرسال البيانات إلى Telegram");
    } catch (error) {
        console.error("❌ خطأ في إرسال البيانات:", error);
    }

    res.send(`
        <h1>🚀 معلومات الزائر</h1>
        <p><strong>🔹 IP Address:</strong> ${ip}</p>
        <p><strong>🔹 Port:</strong> ${port}</p>
        <p><strong>📅 Time:</strong> ${timestamp}</p>
    `);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل على http://localhost:${PORT}`);
});
