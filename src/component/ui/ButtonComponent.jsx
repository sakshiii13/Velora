import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const sizeHeightMap = {
  small: "var(--whiold-button-height-sm)",
  medium: "var(--whiold-button-height-md)",
  large: "var(--whiold-button-height-lg)",
};

const ButtonComponent = ({
  children,
  variant = "contained",
  color = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  sx = {}, 
}) => {
  const isBrandContained = variant === "contained" && color === "primary";

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      type={type}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={!loading ? startIcon : null}
      endIcon={!loading ? endIcon : null}
      onClick={onClick}
      sx={{
  textTransform: "none",
  borderRadius: "var(--whiold-button-radius)",
  height: sizeHeightMap[size] || "var(--whiold-button-height-md)",
  minHeight: sizeHeightMap[size] || "var(--whiold-button-height-md)",
  paddingInline: "var(--whiold-button-padding-x)",
  paddingBlock: 0,
  lineHeight: 1,
  fontWeight: "var(--whiold-button-font-weight)",
  fontSize: "var(--whiold-button-font-size)",
  boxShadow: "none",
  gap: "6px",
  whiteSpace: "nowrap",
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  "& .MuiButton-startIcon, & .MuiButton-endIcon": {
    margin: 0,
  },
  ...(isBrandContained && {
    background: "var(--whiold-button-bg)",
    color: "var(--whiold-button-text)",
    boxShadow: "var(--whiold-button-shadow)",
    "&:hover": {
      background: "var(--whiold-button-bg-hover)",
      boxShadow: "var(--whiold-button-shadow)",
    },
    "&.Mui-disabled": {
      background: "var(--whiold-button-disabled-bg)",
      color: "var(--whiold-button-disabled-text)",
    },
  }),
  ...sx,
}}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        children
      )}
    </Button>
  );
};

export default ButtonComponent;