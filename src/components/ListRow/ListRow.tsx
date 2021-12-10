import { Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./ListRow.scss";

interface ListRowProps {
  title: string;
  indented?: boolean;
  id?: string;
  balance: string;
  isLoading?: boolean;
}

const ListRow = (props: ListRowProps) => {
  return (
    <div className="data-row" style={props.indented ? { paddingLeft: "10px" } : {}}>
      <Typography variant={props.indented ? `body2` : `body1`} color={props.indented ? "textSecondary" : "primary"}>
        {props.title}
      </Typography>
      <Typography
        variant={props.indented ? `body2` : `body1`}
        id={props.id}
        color={props.indented ? "textSecondary" : "primary"}
      >
        {props.isLoading ? <Skeleton width="80px" /> : <>{props.balance}</>}
      </Typography>
    </div>
  );
};

export default ListRow;
