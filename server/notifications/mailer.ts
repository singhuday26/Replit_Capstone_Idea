import nodemailer, { type SendMailOptions } from "nodemailer";

export type MailMode = "smtp" | "ethereal" | "stream";

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface SendMailOptionsExt {
  forceSmtp?: boolean;
}

export interface SendMailResult {
  mode: MailMode;
  messageId: string;
  accepted: string[];
  rejected: string[];
  previewUrl?: string;
}

export function resolveAlertEmail(): string {
  return process.env.ALERT_EMAIL_TO ?? "singhuday2612@gmail.com";
}

function normalizeRecipients(recipients: unknown): string[] {
  if (!Array.isArray(recipients)) {
    return [];
  }

  return recipients.map((value) => {
    if (typeof value === "string") {
      return value;
    }

    if (value && typeof value === "object" && "address" in value) {
      return String((value as { address?: unknown }).address ?? "");
    }

    return String(value);
  });
}

function hasSmtpConfig(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );
}

async function createTransport(modePreference?: MailMode) {
  const preferred =
    modePreference ?? (process.env.MAIL_TEST_MODE as MailMode | undefined);

  if (hasSmtpConfig()) {
    const port = Number(process.env.SMTP_PORT ?? "587");
    const secure = process.env.SMTP_SECURE === "true" || port === 465;

    return {
      mode: "smtp" as const,
      transporter: nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }),
    };
  }

  if (preferred === "stream") {
    return {
      mode: "stream" as const,
      transporter: nodemailer.createTransport({
        streamTransport: true,
        buffer: true,
        newline: "unix",
      }),
    };
  }

  const testAccount = await nodemailer.createTestAccount();
  return {
    mode: "ethereal" as const,
    transporter: nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    }),
  };
}

export async function sendMail(
  message: MailMessage,
  options: SendMailOptionsExt = {},
): Promise<SendMailResult> {
  if (options.forceSmtp && !hasSmtpConfig()) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM for real delivery.",
    );
  }

  const from =
    process.env.MAIL_FROM ?? process.env.SMTP_USER ?? "noreply@local.dev";
  const { mode, transporter } = await createTransport();

  const payload: SendMailOptions = {
    from,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  };

  const info = await transporter.sendMail(payload);
  const previewCandidate =
    mode === "ethereal" ? nodemailer.getTestMessageUrl(info) : undefined;

  return {
    mode,
    messageId: info.messageId,
    accepted: normalizeRecipients(info.accepted),
    rejected: normalizeRecipients(info.rejected),
    previewUrl:
      typeof previewCandidate === "string" ? previewCandidate : undefined,
  };
}
