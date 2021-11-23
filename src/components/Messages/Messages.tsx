import Alert, { Color } from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { LinearProgress, Snackbar, makeStyles } from "@material-ui/core";
import { useAppSelector } from "../../hooks";
import { close, handle_obsolete, Message } from "../../slices/MessagesSlice";
import store from "../../store";
import "./ConsoleInterceptor";

const useStyles = makeStyles({
  root: {
    width: "100%",
    marginTop: "10px",
  },
});

function Linear({ message }: { message: Message }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    const timer: number = window.setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress === 0) {
          window.clearInterval(timer);
          dispatch(close(message));
          return 0;
        }
        const diff = oldProgress - 5;
        return diff;
      });
    }, 333);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <LinearProgress variant="determinate" value={progress} />
    </div>
  );
}

// A component that displays error messages
function Messages() {
  const messages = useAppSelector(state => state.messages);
  const dispatch = useDispatch();

  // Returns a function that can closes a message
  const handleClose = function (message: Message) {
    return function () {
      dispatch(close(message));
    };
  };

  return (
    <div>
      <div>
        {messages.items.map((message: Message, index: number) => {
          return (
            <Snackbar open={message.open} key={index} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
              <Alert
                variant="filled"
                icon={false}
                severity={message.severity as Color}
                onClose={handleClose(message)}
                // NOTE (appleseed): mui includes overflow-wrap: "break-word", but word-break: "break-word" is needed for webKit browsers
                style={{ wordBreak: "break-word" }}
              >
                <AlertTitle>{message.title}</AlertTitle>
                {message.text}
                <Linear message={message} />
              </Alert>
            </Snackbar>
          );
        })}
      </div>
    </div>
  );
}
// Invoke repetedly obsolete messages deletion (should be in slice file but I cannot find a way to access the store from there)
window.setInterval(() => {
  store.dispatch(handle_obsolete());
}, 60000);

export default Messages;
