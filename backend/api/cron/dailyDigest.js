import { connectDB } from "../../lib/db.js";
import User from "../../models/User.js";
import { fetchNewsByTopic } from "../../lib/news.js";
import fetch from "node-fetch";

/**
 * CRON JOB: Send daily news digest to all users
 * Triggered by Vercel Cron (GET request)
 */
export default async function handler(req, res) {
  /* Allow only GET (Vercel cron uses GET) */
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const startTime = new Date().toISOString();
  console.log("CRON STARTED:", startTime);

  try {
    await connectDB();

    // 1. Fetch subscribed users with topics
    const users = await User.find({
      topics: { $exists: true, $not: { $size: 0 } },
      isSubscribed: true,
    });

    if (users.length === 0) {
      console.log("No subscribed users with topics");
      return res.status(200).json({
        message: "No users to send emails",
        time: startTime,
      });
    }

    // 2. Process each user
    for (const user of users) {
      let emailContent = `
        <h2 style="font-family: Arial;">Your Daily News Digest</h2>
        <p style="font-family: Arial;">Based on your selected topics</p>
        <hr/>
      `;

      for (const topic of user.topics) {
        const articles = await fetchNewsByTopic(topic);

        emailContent += `
          <h3 style="font-family: Arial; color: #333;">
            ${topic.toUpperCase()}
          </h3>
        `;

        articles.forEach((article) => {
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

              <h4>${article.title}</h4>
              <p>${article.description || "No description available"}</p>
              <p><strong>Source:</strong> ${article.source}</p>

              <a href="${article.url}" target="_blank"
                 style="color:#1a73e8; text-decoration:none;">
                Read more
              </a>
            </div>
            <hr/>
          `;
        });
      }

      // 3. Send email via Brevo
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            email: "blgrkiru@gmail.com",
            name: "News Digest",
          },
          to: [{ email: user.email }],
          subject: "Your Daily News Digest",
          htmlContent: emailContent,
        }),
      });

      console.log(`Email sent to ${user.email}`);
    }

    console.log("CRON FINISHED:", new Date().toISOString());

    return res.status(200).json({
      message: "Daily digest emails sent successfully",
      executedAt: startTime,
      userCount: users.length,
    });

  } catch (error) {
    console.error("CRON FAILED:", error);
    return res.status(500).json({ message: "Cron job failed" });
  }
}
