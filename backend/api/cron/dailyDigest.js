import { connectDB } from "../../lib/db.js";
import User from "../../models/User.js"; 
import { fetchNewsByTopic } from "../../lib/news.js";
import fetch from "node-fetch";

/**
 * CRON JOB: Send daily news digest to all users (with images)
 * Triggered by Vercel Cron (time-based)
 */
export default async function handler(req, res) {
  try {
    // Optional safety: allow only GET (cron uses GET)
    //if (req.method !== "GET") {
      //return res.status(405).json({ message: "Method not allowed" });
    //}

    // VERY IMPORTANT for serverless
    await connectDB();

    console.log("Cron job started");

    // 1. Fetch users who have topics
    const users = await User.find({
      topics: { $exists: true, $not: { $size: 0 } },
      isSubscribed: true
    });

    if (users.length === 0) {
      console.log("No users with topics found");
      return res.json({ message: "No users to send emails" });
    }

    // 2. Loop through each user
    for (const user of users) {
      let emailContent = `
        <h2 style="font-family: Arial;">Your Daily News Digest</h2>
        <hr/>
      `;

      // 3. Fetch news for each topic
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

              <p>
                ${article.description || "No description available"}
              </p>

              <p>
                <strong>Source:</strong> ${article.source}
              </p>

              <a
                href="${article.url}"
                target="_blank"
                style="color:#1a73e8; text-decoration:none;"
              >
                Read more
              </a>

            </div>
            <hr/>
          `;
        });
      }

      // 4. Send email via Brevo
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            email: "blgrkiru@gmail.com",
            name: "News Digest"
          },
          to: [{ email: user.email }],
          subject: "Your Daily News Digest",
          htmlContent: emailContent,
        }),
      });

      console.log(`Email sent to ${user.email}`);
    }

    console.log("Cron job finished");
    res.json({ message: "Daily digest emails sent successfully" });

  } catch (error) {
    console.error("Cron job failed:", error);
    res.status(500).json({ message: "Cron job failed" });
  }
}
