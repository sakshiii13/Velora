import React from "react";
import { Card, Chip } from "@mui/material";

/**
 * AccountStatusCard
 * Bottom "account overview" card: a status chip, heading, description, and a
 * grid of small stat tiles.
 *
 * @param {{
 *   statusLabel: string,
 *   statusClassName?: string,   // MUI Chip color classes
 *   heading: string,
 *   description: string,
 *   stats: { label: string, value: string|number }[]
 * }} props
 */
const AccountStatusCard = ({
  statusLabel = "ACTIVE ACCOUNT",
  statusClassName = "!bg-green-100 !text-green-700 !font-semibold",
  heading,
  description,
  stats = [],
}) => {
  return (
    <Card
      elevation={0}
      className="!overflow-hidden !rounded-[32px] !border !border-[var(--whiold-border)] !bg-white !shadow-xl transition-all duration-500 hover:border-[var(--whiold-primary)] hover:shadow-xl"
    >
      <div className="relative overflow-hidden">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[var(--whiold-primary-soft)] opacity-70 blur-3xl" />

        <div className="relative p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Chip label={statusLabel} className={`!mb-4 ${statusClassName}`} />

              <h2 className="text-3xl font-black text-[var(--whiold-text-heading)]">
                {heading}
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-[var(--whiold-text-body)]">
                {description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[var(--whiold-border)] bg-[var(--whiold-primary-soft)] p-5"
                >
                  <p className="text-xs uppercase tracking-wider text-[var(--whiold-text-muted)]">
                    {stat.label}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">{stat.value}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AccountStatusCard;