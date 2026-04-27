"use client";

export default function CookieResetButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          localStorage.removeItem("habitat3ri-cookie-consent");
          window.location.reload();
        } catch {
          // localStorage unavailable
        }
      }}
      className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
    >
      {label}
    </button>
  );
}
