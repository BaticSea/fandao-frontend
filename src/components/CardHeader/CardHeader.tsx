import { Box, Typography } from "@material-ui/core";

// (aphex) removed children arg in favor of spread to silence compiler while refactoring parents
const CardHeader: React.FC<{ title: string }> = ({ title, ...props }) => (
  <Box className="card-header">
    <Typography variant="h5">{title}</Typography>
    {props.children}
  </Box>
);

export default CardHeader;
