import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import React from "react";
const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="10px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
      >
        {title}
      </Typography>
      <Typography variant="h5" color={"rgb(119,213,203)"}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;