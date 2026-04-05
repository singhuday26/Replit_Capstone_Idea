import { resolveAlertEmail, sendMail } from "../server/notifications/mailer";

async function run() {
  const to = resolveAlertEmail();

  const result = await sendMail({
    to,
    subject: "[Capstone AI] Mail pipeline test",
    text: "This is a test email from the Capstone AI development workflow.",
    html: "<p>This is a test email from the <strong>Capstone AI</strong> development workflow.</p>",
  });

  console.log(`Mail test finished using mode: ${result.mode}`);
  console.log(`Message ID: ${result.messageId}`);
  console.log(`Accepted: ${result.accepted.join(", ") || "none"}`);
  console.log(`Rejected: ${result.rejected.join(", ") || "none"}`);

  if (result.previewUrl) {
    console.log(`Preview URL (ethereal): ${result.previewUrl}`);
  }

  if (result.mode !== "smtp") {
    console.log(
      "Real delivery is not active. Configure SMTP_* variables and MAIL_FROM to send actual emails.",
    );
  }
}

run().catch((error) => {
  console.error("Mail test failed:", error);
  process.exit(1);
});
