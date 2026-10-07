const DashboardFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4"
      style={{
        borderTop: "1px solid var(--whiold-border)",
        background: "var(--whiold-bg)",
      }}
    >
      <p
        className="text-xs"
        style={{ color: "var(--whiold-text-muted)" }}
      >
        © {year} Whiold Atelier. All rights reserved.
      </p>

      <div
        className="flex items-center gap-5 text-xs font-medium"
        style={{ color: "var(--whiold-text-muted)" }}
      >
        <a
          href="/privacy-policy"
          className="hover:text-(--whiold-text-heading) transition-colors"
        >
          Privacy Policy
        </a>
        <span style={{ color: "var(--whiold-border)" }}>|</span>
        <a
          href="/terms"
          className="hover:text-(--whiold-text-heading) transition-colors"
        >
          Terms
        </a>
        <span style={{ color: "var(--whiold-border)" }}>|</span>
        <span className="text-(--whiold-text-muted)">v1.0.0</span>
      </div>
    </footer>
  );
};

export default DashboardFooter;