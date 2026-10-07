import React, { useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import mainContent from "../../../constants/mainContent";
import ButtonComponent from "../../ui/ButtonComponent";
import { Box } from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';


const WelcomeLetterPage = ({ onClick }) => {
  const { user, handlePrint } = useAuth();

//   useEffect(() => {
//     if (onClick) {
//       onClick;
//     }
//   }, [onClick]);

  return (
    <div className="print:block w-full bg-[var(--whiold-gradient-panel)] px-4 print:bg-white print:py-0">
       <Box sx={{width: "100%", display: "flex", justifyContent: "end", mb: 1}}>
<ButtonComponent onClick={handlePrint}  startIcon={<PrintIcon />}>Print Welcome Letter</ButtonComponent>
       </Box>
      <div
        id="print-invoice"
        className="bg-[var(--whiold-bg)] rounded-[var(--whiold-radius-lg)] shadow-[var(--whiold-shadow-card)] overflow-hidden print:shadow-none print:rounded-none border border-[var(--whiold-border)]"
      >
        {/* Decorative Top Design */}
        <div
          className="relative h-3 print:hidden"
          style={{ background: "var(--whiold-gradient-brand)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Header Section with Enhanced Design */}
        <div className="relative bg-[var(--whiold-bg-soft)] py-12 px-8 border-b-2 border-[var(--whiold-border)] print:border-b print:py-5">
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--whiold-primary-soft)] rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--whiold-primary-soft)] rounded-tr-full"></div>

          <div className="relative text-center">
            {/* Logo with subtle shadow */}
            <div className="flex justify-center mb-6 print:mb-1">
              <div className="bg-[var(--whiold-bg)] p-4 rounded-[var(--whiold-radius-md)] shadow-[var(--whiold-shadow-card)] border-2 border-[var(--whiold-border)] print:p-0 print:shadow-none print:border-none">
                <img
                  src={mainContent.logo}
                  alt={mainContent.appName}
                  className="h-35 w-auto object-center cursor-pointer"
                />
              </div>
            </div>

            {/* Title with gradient text */}
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--whiold-400)] to-[var(--whiold-600)] bg-clip-text text-transparent mb-3 print:hidden">
              Welcome Letter
            </h1>
            <div className="flex items-center justify-center gap-3 mt-4 print:mt-1.5">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--whiold-primary)]"></div>
              <p className="text-[var(--whiold-text-body)] text-base font-medium">
                Congratulations on Joining Our Community
              </p>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--whiold-primary)]"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-10 md:p-12 space-y-8 print:space-y-7 text-[var(--whiold-text-body)]">
          {/* Greeting */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[var(--whiold-text-heading)] print:text-xl">
              Dear{" "}
              <span className="text-[var(--whiold-primary)]">
                {user?.name?.split(" ")[0] || "Member"}
              </span>
              ,
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[var(--whiold-primary)] to-transparent rounded-full"></div>
          </div>

          {/* Introduction */}
          <p className="leading-relaxed text-[var(--whiold-text-body)]">
            We are{" "}
            <span className="font-semibold text-[var(--whiold-primary)]">
              delighted
            </span>{" "}
            to welcome you to our organization. You are now officially a part of
            our growing community, and we look forward to achieving success
            together.
          </p>

          <p className="leading-relaxed text-[var(--whiold-text-muted)]">
            Your registration has been successfully completed. You can now
            access all features, benefits, and opportunities available to our
            members.
          </p>

          {/* Enhanced Membership Card */}
          <div
            className="relative rounded-[var(--whiold-radius-lg)] p-[2px] shadow-[var(--whiold-shadow-card)]"
            style={{ background: "var(--whiold-gradient-brand)" }}
          >
            <div className="bg-[var(--whiold-bg)] rounded-[var(--whiold-radius-lg)] p-8 print:p-4 space-y-6 print:space-y-2">
              {/* Card Header */}
              <div className="flex items-center gap-3 pb-4 border-b-2 border-[var(--whiold-border)]">
                <div
                  className="w-1.5 h-8 rounded-full"
                  style={{ background: "var(--whiold-gradient-brand)" }}
                ></div>
                <h3 className="font-bold text-[var(--whiold-text-heading)] text-xl">
                  Membership Details
                </h3>
              </div>

              {/* Member Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Name Card */}
                <div className="group relative bg-[var(--whiold-primary-soft)] hover:bg-[var(--whiold-100)] transition-all duration-300 rounded-[var(--whiold-radius-md)] p-5 print:p-2 border-2 border-[var(--whiold-border)] hover:border-[var(--whiold-border-hover)] text-center">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[var(--whiold-primary-soft)] rounded-bl-3xl rounded-tr-[var(--whiold-radius-md)]"></div>
                  <p className="text-[var(--whiold-primary)] text-xs font-semibold uppercase tracking-wider mb-2">
                    Member Name
                  </p>
                  <p className="font-bold text-[var(--whiold-text-heading)] text-base mt-1 relative z-10">
                    {user?.name}
                  </p>
                </div>

                {/* User ID Card */}
                <div className="group relative bg-[var(--whiold-primary-soft)] hover:bg-[var(--whiold-100)] transition-all duration-300 rounded-[var(--whiold-radius-md)] p-5 print:p-2 border-2 border-[var(--whiold-border)] hover:border-[var(--whiold-border-hover)] text-center">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[var(--whiold-primary-soft)] rounded-bl-3xl rounded-tr-[var(--whiold-radius-md)]"></div>
                  <p className="text-[var(--whiold-primary)] text-xs font-semibold uppercase tracking-wider mb-2">
                    User ID
                  </p>
                  <p className="font-bold text-[var(--whiold-text-heading)] text-base mt-1 font-mono relative z-10">
                    {user?.userId}
                  </p>
                </div>

                {/* Date Card */}
                <div className="group relative bg-[var(--whiold-primary-soft)] hover:bg-[var(--whiold-100)] transition-all duration-300 rounded-[var(--whiold-radius-md)] p-5 print:p-2 border-2 border-[var(--whiold-border)] hover:border-[var(--whiold-border-hover)] text-center">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[var(--whiold-primary-soft)] rounded-bl-3xl rounded-tr-[var(--whiold-radius-md)]"></div>
                  <p className="text-[var(--whiold-primary)] text-xs font-semibold uppercase tracking-wider mb-2">
                    Joining Date
                  </p>
                  <p className="font-bold text-[var(--whiold-text-heading)] text-base mt-1 relative z-10">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-[var(--whiold-primary-soft)] border-l-4 border-[var(--whiold-primary)] rounded-r-[var(--whiold-radius-md)] p-6 print:px-6 print:py-3 print:mt-1.5">
            <p className="leading-relaxed text-[var(--whiold-text-body)]">
              We encourage you to explore the platform, participate actively,
              and take full advantage of the opportunities available to you as a
              valued member.
            </p>
          </div>

          <p className="leading-relaxed text-[var(--whiold-text-muted)]">
            If you have any questions or need assistance, our support team is
            always here to help you. We're committed to ensuring you have the
            best experience possible.
          </p>

          {/* Signature Section */}
          <div className="pt-10 mt-8 border-t-2 border-[var(--whiold-border)] print:pt-5 print:mt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">
              {/* Company Info */}
              <div className="space-y-2">
                <p className="font-bold text-xl text-[var(--whiold-text-heading)]">
                  Best Regards,
                </p>
                <p className="text-[var(--whiold-primary)] font-semibold text-lg">
                  {mainContent?.address?.split(",")[0]}
                </p>
                <p className="text-[var(--whiold-text-muted)] text-sm">
                  Management Team
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative bg-[var(--whiold-bg-soft)] text-center py-6 border-t-2 border-[var(--whiold-border)] print:bg-white">
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--whiold-text-body)]">
            <svg
              className="w-4 h-4 text-[var(--whiold-primary)]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              © 2026{" "}
              <span className="font-semibold text-[var(--whiold-primary)]">
                {mainContent?.name}
              </span>
              . All rights reserved.
            </span>
          </div>
        </div>

        {/* Decorative Bottom Bar */}
        <div
          className="h-2"
          style={{ background: "var(--whiold-gradient-brand)" }}
        ></div>
      </div>

      {/* ================= PRINT CSS ================= */}
      <style>
        {`
    @media print {
      * {
        box-shadow: none !important;
        text-shadow: none !important;
      }

      body * {
        visibility: hidden !important;
      }

      .app-header,
      .MuiAppBar-root,
      .MuiDrawer-root {
        display: none !important;
      }

      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      #print-invoice,
      #print-invoice * {
        visibility: visible !important;
      }

      #print-invoice {
        position: absolute;
        left: 0;
        top: 0;
        width: 100% !important;
      }

      @page {
        size: A4;
        margin: 0.5cm;
      }
    }
  `}
      </style>
    </div>
  );
};

export default WelcomeLetterPage;
