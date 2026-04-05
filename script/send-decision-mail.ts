import { resolveAlertEmail, sendMail } from "../server/notifications/mailer";

function parseArgs(args: string[]) {
  const [subjectArg, ...messageParts] = args;

  const subject = subjectArg?.trim() || "[Capstone AI] Decision Required";
  const message = messageParts.join(" ").trim();

  if (!message) {
    throw new Error(
      'Usage: npm run mail:decision -- "Subject" "Decision details and options"',
    );
  }

  return { subject, message };
}

async function run() {
  const { subject, message } = parseArgs(process.argv.slice(2));

  const result = await sendMail(
    {
      to: resolveAlertEmail(),
      subject,
      text: message,
      html: `<p>${message}</p>`,
    },
    { forceSmtp: true },
  );

  console.log(`Decision email sent using ${result.mode}`);
  console.log(`Message ID: ${result.messageId}`);
}

run().catch((error) => {
  console.error("Unable to send decision email:", error.message);
  process.exit(1);
});
