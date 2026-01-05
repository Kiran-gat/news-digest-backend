import User from "../../models/User.js";
import { verifyToken } from "../../lib/jwt.js";
import { fetchNewsByTopic } from "../../lib/news.js";
import fetch from "node-fetch";

/**
 * Manually send news digest email (with images)
 */


export default async function handler(req, res) {
  
  try {
    // 1. Verify JWT
    await connectDB(); 
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // 2. Get user
    const user = await User.findById(decoded.userId);
    if (!user || user.topics.length === 0) {
      return res.status(400).json({ message: "No topics selected" });
    }

    // 3. Build email content
    let emailContent = `
      <h2 style="font-family: Arial;">Your Personalized News Digest</h2>
      <p style="font-family: Arial;">Based on your selected topics</p>
      <hr/>
    `;

    // 4. Fetch news for each topic
    for (const topic of user.topics) {
      const articles = await fetchNewsByTopic(topic);

      emailContent += `
        <h3 style="font-family: Arial; color: #333;">
          ${topic.toUpperCase()}
        </h3>
      `;

      articles.forEach(article => {
        emailContent += `
          <div style="margin-bottom: 20px; font-family: Arial;">
            
            ${
              article.image
                ? `<img 
                     src="${article.image}" 
                     alt="news image" 
                     style="width:100%; max-width:500px; border-radius:6px; margin-bottom:10px;" 
                   />`
                : ""
            }

            <h4 style="margin: 5px 0;">${article.title}</h4>
            <p>${article.description || "Read full article for more details."}</p>
            <p>
              <strong>Source:</strong> ${article.source}
            </p>
            <a 
              href="${article.url}" 
              target="_blank" 
              style="color:#1a73e8; text-decoration:none;"
            >
              Read full article
            </a>

          </div>
          <hr/>
        `;
      });
    }

    // 5. Send email using Brevo
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: "blgrkiru@gmail.com", name: "News Digest" },
        to: [{ email: user.email }],
        subject: "Your Personalized News Digest",
        htmlContent: emailContent,
      }),
    });

    res.json({ message: "News digest email sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email sending failed" });
  }
};
