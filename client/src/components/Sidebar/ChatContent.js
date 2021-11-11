import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  notiPreviewText: {
    fontSize: 12,
    letterSpacing: -0.17,
    maxWidth: '6.5rem',
    fontWeight: "bold",
    overflowX: 'hidden',
  },
  counter: {
    backgroundColor: '#3A8DFF',
    borderRadius: '999px',
    color: '#FFF',
    height: '1.5rem',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
  }
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;

  const unreadMessageCounter = (conversation) => {
    let count = 0;
    conversation.messages.forEach((message) => {
      if (message.senderId === otherUser.id && !message.readByReceiver) {
        count++
      }
    })

    return count
  }

  const counter = unreadMessageCounter(conversation)

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>

        <Typography className={counter ? classes.notiPreviewText : classes.previewText}>
          {latestMessageText}
        </Typography>

      </Box>
      {!!counter && (
        <Box className={classes.counter}>
          {counter}
        </Box>
      )}

    </Box>
  );
};

export default ChatContent;
