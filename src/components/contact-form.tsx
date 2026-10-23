"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(60, "Name is too long."),
  email: z.email("Please enter a valid email address.").max(120, "Email is too long."),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters — give me something to work with.")
    .max(2000, "Message is too long (2000 characters maximum)."),
  website: z.string().max(200).optional(), // honeypot
});

type FormValues = z.infer<typeof formSchema>;

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

/**
 * Contact form — client-side validation mirrors the server schema,
 * a honeypot field filters silent bots, and the success state is only
 * shown after the server confirms the message was stored.
 */
export function ContactForm() {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setState({ kind: "submitting" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      if (!response.ok || !data.ok) {
        if (data.fieldErrors) {
          for (const [field, message] of Object.entries(data.fieldErrors)) {
            if (field in formSchema.shape) {
              setError(field as keyof FormValues, { message });
            }
          }
        }
        setState({
          kind: "error",
          message:
            data.error ??
            "Something went wrong while sending your message. Please try again.",
        });
        return;
      }

      setState({ kind: "success" });
    } catch {
      setState({
        kind: "error",
        message:
          "Network error — your message was not sent. Please check your connection and try again.",
      });
    }
  };

  if (state.kind === "success") {
    return (
      <div
        role="status"
        className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-lg border border-border bg-card p-10 text-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent-blue/30 bg-accent-blue/10">
          <CheckCircle2 className="h-6 w-6 text-accent-blue" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-xl font-semibold tracking-tight">
          Message received.
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thanks for reaching out — your message is safely stored and I&apos;ll
          reply to your email address. Genuine messages always get a response.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            reset();
            setState({ kind: "idle" });
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-lg border border-border bg-card p-6 sm:p-8"
      aria-label="Contact form"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="label-mono text-muted-foreground">
            Name
          </label>
          <Input
            id="contact-name"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={cn("h-11", errors.name && "border-destructive")}
            {...register("name")}
          />
          {errors.name ? (
            <p id="contact-name-error" role="alert" className="text-[13px] text-destructive">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-email" className="label-mono text-muted-foreground">
            Email
          </label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={cn("h-11", errors.email && "border-destructive")}
            {...register("email")}
          />
          {errors.email ? (
            <p id="contact-email-error" role="alert" className="text-[13px] text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <label htmlFor="contact-message" className="label-mono text-muted-foreground">
          Message
        </label>
        <Textarea
          id="contact-message"
          rows={7}
          placeholder="What would you like to discuss? Projects, opportunities, collaborations — or a good question about any of my work."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : "contact-hint"}
          className={cn("resize-y", errors.message && "border-destructive")}
          {...register("message")}
        />
        {errors.message ? (
          <p id="contact-message-error" role="alert" className="text-[13px] text-destructive">
            {errors.message.message}
          </p>
        ) : (
          <p id="contact-hint" className="text-[12px] text-muted-foreground/70">
            20–2000 characters. The form is validated, spam-protected and
            stored directly — no third-party processor involved.
          </p>
        )}
      </div>

      {/* Honeypot — visually hidden, ignored by humans, irresistible to bots */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <Input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {state.kind === "error" ? (
        <p
          role="alert"
          className="mt-5 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {state.message}
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="hidden font-mono text-[11px] text-muted-foreground/60 sm:block">
          replies to every genuine message
        </p>
        <Button
          type="submit"
          disabled={state.kind === "submitting"}
          className="h-11 gap-2 px-6 active:scale-[0.98] motion-reduce:active:transform-none"
        >
          {state.kind === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Send message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
