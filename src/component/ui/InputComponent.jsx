import { useState } from "react";
import { TextField, InputAdornment, IconButton, MenuItem } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";


const baseSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "var(--whiold-input-radius)",
    backgroundColor: "var(--whiold-input-bg)",
    transition: "box-shadow 0.2s ease, background-color 0.2s ease",
    "& fieldset": {
      borderColor: "var(--whiold-input-border)",
      transition: "border-color 0.2s ease",
    },
    "&:hover fieldset": {
      borderColor: "var(--whiold-input-border-hover)",
    },
    "&.Mui-focused": {
      backgroundColor: "var(--whiold-input-bg-focus)",
      // boxShadow: "var(--whiold-input-focus-ring)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--whiold-input-border-focus)",
      borderWidth: "1.5px",
    },
    "&.Mui-error fieldset": {
      borderColor: "var(--whiold-input-error-border)",
    },
    "&.Mui-disabled": {
      backgroundColor: "var(--whiold-input-bg-disabled)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "var(--whiold-input-label-color)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--whiold-primary)",
  },
  "& .MuiFormHelperText-root": {
    marginLeft: "4px",
    fontSize: "12.5px",
    color: "var(--whiold-input-helper-color)",
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: "var(--whiold-input-error-text)",
  },
  "& .MuiOutlinedInput-input": {
    fontSize: "14.5px",
    padding: "14.5px 16px",
    color: "var(--whiold-input-text-color)",
  },
  "& .MuiOutlinedInput-input::placeholder": {
    color: "var(--whiold-input-placeholder-color)",
    opacity: 1,
  },
};

const menuItemSx = {
  fontSize: "14px",
  borderRadius: "10px",
  margin: "2px 6px",
  "&:hover": { backgroundColor: "var(--whiold-primary-soft)" },
  "&.Mui-selected": {
    backgroundColor: "var(--whiold-primary-soft)",
    color: "var(--whiold-primary)",
    fontWeight: 600,
  },
  "&.Mui-selected:hover": { backgroundColor: "var(--whiold-200)" },
};

const InputComponent = ({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  error = false,
  helperText,
  disabled = false,
  required = false,
  options = [], 
  rows = 4,
  fullWidth = true,
  sx = {},
  startIcon,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  // input type
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <TextField
      label={label}
      type={inputType === "textarea" || inputType === "select" ? undefined : inputType}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      multiline={type === "textarea"}
      rows={type === "textarea" ? rows : 1}
      select={type === "select"}
      variant="outlined"
      sx={{ ...baseSx, ...sx }}
      // Password eye icon
      slotProps={{
        input: {
          startAdornment: startIcon ? (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ) : null,
          endAdornment:
            type === "password" ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={handlePasswordToggle}
                  edge="end"
                  aria-label="toggle password"
                  sx={{
                    color: "var(--whiold-text-muted)",
                    "&:hover": {
                      backgroundColor: "var(--whiold-primary-soft)",
                      color: "var(--whiold-primary)",
                    },
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : null,
        },
      }}
    >
      {/* Options for Select type */}
      {type === "select" &&
        options.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={menuItemSx}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default InputComponent;