import { Grid, Paper, Typography } from "@material-ui/core";
interface CardProps {
  headerText: string;
  headerContent?: any;
  children?: any;
}

const Card = (props: CardProps) => {
  return (
    <Paper className={`ohm-card`}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <div className="card-header">
            <Typography variant="h5">{props.headerText}</Typography>
            {props.headerContent}
          </div>
        </Grid>
        {props.children}
      </Grid>
    </Paper>
  );
};
export default Card;
