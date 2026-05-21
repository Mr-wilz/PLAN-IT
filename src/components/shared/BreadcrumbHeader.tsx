import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbHeaderProps = {
  title: string;
  subtitle?: string;
  items: BreadcrumbItem[];
  backLabel?: string;
  actions?: ReactNode;
  className?: string;
  dark?: boolean;
};

export default function BreadcrumbHeader({
  title,
  subtitle,
  items,
  backLabel = "Back",
  actions,
  className = "",
  dark = false,
}: BreadcrumbHeaderProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`mb-6 rounded-2xl border px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.06)] backdrop-blur-lg sm:px-6 lg:px-8 ${
        dark ? "border-amber-200/20 bg-white/4" : "border-white/40 bg-white/80"
      } ${className}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 font-medium transition ${
                dark
                  ? "bg-white/6 text-white hover:bg-white/10"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ArrowLeft size={16} />
              {backLabel}
            </button>
            {items.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="flex items-center gap-2"
              >
                <ChevronRight
                  size={14}
                  className={dark ? "text-white/45" : "text-gray-400"}
                />
                {item.to ? (
                  <Link
                    to={item.to}
                    className={`font-medium transition hover:text-primary-500 ${dark ? "text-white/75" : "text-gray-600"}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-primary-500">
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-primary-500 md:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p
              className={`mt-2 text-sm md:text-base ${
                dark ? "text-white" : "text-gray-600"
              }`}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
