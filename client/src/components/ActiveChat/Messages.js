import React from "react";
import { Box, Avatar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const useStyles = makeStyles(() => ({
  root: {
    maxHeight: '75vh',
    overflowY: 'scroll',
    scrollMargin: '10px',
    paddingRight: '1rem',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f4f6fa'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c2c3c6',
      borderRadius: '16px',
    }
  },
  avatar: {
    height: '1.5rem',
    width: '1.5rem',
    marginTop: '.5rem'
  }
}));

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId, lastMessageReadId } = props;

  return (
    <Box className={classes.root}>
      {messages.map((message) => {

        const time = moment(message.createdAt).format("h:mm");

        let notificationBubble = (<SenderBubble key={message.id} text={message.text} time={time} />)
        if (message.id === lastMessageReadId) {
          notificationBubble = (
            <Grid key={message.id} container alignItems='flex-end' direction='column'>
              <SenderBubble text={message.text} time={time} />
              <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar>
            </Grid>
          )
        }

        return message.senderId === userId ? (
          notificationBubble
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
