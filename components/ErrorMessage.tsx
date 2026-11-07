type ErrorMessageProps = {
  title?: string;
  message: string;
  action?: React.ReactNode;
};

export function ErrorMessage({
  title = "Something went wrong",
  message,
  action,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-ow-danger/40 bg-ow-danger/10 p-6 text-center shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
    >
      <h2 className="text-lg font-black tracking-tight text-ow-text">{title}</h2>
      <p className="max-w-xl text-sm font-semibold text-ow-text/75">
        {message}
      </p>
      {action}
    </div>
  );
}
