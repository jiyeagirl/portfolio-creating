"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("올바른 이메일 주소를 입력해 주세요.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-6 px-6 py-16 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16">
        <div>
          <h2 className="text-[24px] font-semibold tracking-tight sm:text-[28px]">
            소식을 가장 먼저 받아보세요
          </h2>
          <p className="mt-2 max-w-[46ch] text-[14px] leading-relaxed text-muted">
            신상품 소식과 시즌 오프 정보를 이메일로 보내드립니다.
          </p>
        </div>

        {submitted ? (
          <div className="flex items-center gap-2 text-[14px] font-medium text-accent">
            <CheckCircle size={20} weight="fill" />
            구독이 완료되었습니다.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex w-full max-w-[420px] flex-col gap-2"
          >
            <div className="flex gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                이메일 주소
              </label>
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? "newsletter-error" : undefined}
                className="w-full rounded-full border border-border bg-surface-elevated px-5 py-3 text-[14px] text-foreground placeholder:text-muted focus:border-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-5 py-3 text-[14px] font-semibold text-background transition-transform active:scale-[0.98]"
              >
                구독
                <ArrowRight size={15} weight="bold" />
              </button>
            </div>
            {error && (
              <p
                id="newsletter-error"
                className="text-[12px] text-red-600 dark:text-red-400"
              >
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
