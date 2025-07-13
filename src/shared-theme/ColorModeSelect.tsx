import { IconButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function ColorModeSelect({ sx }: { sx?: any }) {
  return (
    <IconButton sx={sx}>
      <LightModeIcon />
    </IconButton>
  );
}
