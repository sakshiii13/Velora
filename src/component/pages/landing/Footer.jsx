import React from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Box,
} from "@mui/material";

import { Send, Phone, Mail, MapPin } from "lucide-react";
import mainContent from "../../../constants/mainContent";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "var(--whiold-gradient-panel)",
        borderTop: "1px solid var(--whiold-border)",
        mt: 12,
      }}
    >
      {/* Top Border */}
      <Box
        sx={{
          height: 4,
          background: "var(--whiold-gradient-brand)",
        }}
      />

      <Container maxWidth="xl" className="py-20 max-w-7xl">
        {/* Newsletter */}

        <div className="mb-20 overflow-hidden rounded-[32px] border border-[var(--whiold-border)] bg-white shadow-[var(--whiold-shadow-card)]">
          <Grid container>
            <Grid
              size={{ xs: 12, lg: 6 }}
              className="flex flex-col justify-center p-10 lg:p-14"
            >
              <Typography
                sx={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "var(--whiold-text-heading)",
                }}
              >
                Join Our Community
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  color: "var(--whiold-text-body)",
                  lineHeight: 1.8,
                }}
              >
                Subscribe to receive exclusive collections, luxury fashion
                updates and early access to premium launches.
              </Typography>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <TextField
                  fullWidth
                  placeholder="Enter your email"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "var(--whiold-radius-md)",
                      background: "var(--whiold-bg-input)",
                    },
                  }}
                />

                <Button
                  endIcon={<Send size={18} />}
                  sx={{
                    minWidth: 180,
                    borderRadius: "var(--whiold-radius-md)",
                    color: "#fff",
                    background: "var(--whiold-gradient-brand)",
                    "&:hover": {
                      background: "var(--whiold-gradient-brand-hover)",
                    },
                  }}
                >
                  Subscribe
                </Button>
              </div>
            </Grid>

            <Grid
              size={{ xs: 12, lg: 6 }}
              className="hidden lg:flex items-center justify-center"
            >
              <img
                src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900"
                alt="Fashion"
                className="h-full w-full object-cover"
              />
            </Grid>
          </Grid>
        </div>

        {/* Links */}

        <Grid container spacing={6}>
          {/* Brand */}

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <div className="mb-5">
              <img
                src={mainContent.logo}
                alt={mainContent.appName}
                className="h-29 w-auto object-contain"
              />
            </div>

            <Typography
              sx={{
                mt: 3,
                color: "var(--whiold-text-body)",
                lineHeight: 2,
              }}
            >
              Modern luxury fashion crafted with premium materials and timeless
              elegance. Every piece is designed to elevate your everyday
              wardrobe.
            </Typography>
          </Grid>

          {/* Shop */}

          <Grid size={{ xs: 6, md: 3, lg: 2 }}>
            <Typography
              sx={{
                mb: 3,
                fontWeight: 700,
                color: "var(--whiold-text-heading)",
              }}
            >
              Shop
            </Typography>

            <div className="space-y-4">
              {["New Arrivals", "Men", "Women", "Accessories", "Sale"].map(
                (item) => (
                  <Typography
                    key={item}
                    className="cursor-pointer transition-all hover:translate-x-1"
                    sx={{
                      color: "var(--whiold-text-body)",
                    }}
                  >
                    {item}
                  </Typography>
                ),
              )}
            </div>
          </Grid>

          {/* Company */}

          <Grid size={{ xs: 6, md: 3, lg: 2 }}>
            <Typography
              sx={{
                mb: 3,
                fontWeight: 700,
                color: "var(--whiold-text-heading)",
              }}
            >
              Company
            </Typography>

            <div className="space-y-4">
              {[
                "About",
                "Our Story",
                "Careers",
                "Contact",
                "Privacy Policy",
              ].map((item) => (
                <Typography
                  key={item}
                  className="cursor-pointer transition-all hover:translate-x-1"
                  sx={{
                    color: "var(--whiold-text-body)",
                  }}
                >
                  {item}
                </Typography>
              ))}
            </div>
          </Grid>

          {/* Contact */}

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Typography
              sx={{
                mb: 3,
                fontWeight: 700,
                color: "var(--whiold-text-heading)",
              }}
            >
              Contact
            </Typography>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <MapPin size={18} color="var(--whiold-primary)" />
                <Typography color="var(--whiold-text-body)">
                  New Delhi, India
                </Typography>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} color="var(--whiold-primary)" />
                <Typography color="var(--whiold-text-body)">
                  +91 98765 43210
                </Typography>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} color="var(--whiold-primary)" />
                <Typography color="var(--whiold-text-body)">
                  support@whiold.com
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>

        <Divider sx={{ my: 8 }} />
        {/* Bottom Footer */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Copyright */}

          <div>
            <Typography
              sx={{
                color: "var(--whiold-text-body)",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              © {new Date().getFullYear()} WHIOLD. All Rights Reserved.
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "var(--whiold-text-muted)",
                fontSize: 13,
              }}
            >
              Crafted with premium design and timeless elegance.
            </Typography>
          </div>

          {/* Social Icons */}

          {/* <div className="flex items-center gap-3">

            {[
              { icon: <Facebook size={20} />, href: "#" },
              { icon: <Twitter size={20} />, href: "#" },
              { icon: <Instagram size={20} />, href: "#" },
              { icon: <Pinterest size={20} />, href: "#" },
            ].map((item, index) => (

              <IconButton
                key={index}
                component="a"
                href={item.href}
                sx={{
                  width: 48,
                  height: 48,
                  border: "1px solid var(--whiold-border)",
                  background: "#fff",
                  transition: ".35s",

                  "&:hover": {
                    color: "#fff",
                    transform: "translateY(-5px)",
                    background:
                      "var(--whiold-gradient-brand)",
                    boxShadow:
                      "var(--whiold-shadow-btn)",
                  },
                }}
              >
                {item.icon}
              </IconButton>

            ))}

          </div> */}
        </div>
      </Container>
    </Box>
  );
};

export default Footer;
