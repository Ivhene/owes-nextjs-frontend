import { Label } from "@/components/ui/label";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
};

export function FormField({
  label,
  htmlFor,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-ow-text">
        {label}
        {required && (
          <span aria-hidden className="text-ow-orange">
            *
          </span>
        )}
      </Label>
      {children}
    </div>
  );
}
