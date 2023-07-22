import react, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import moment from 'moment';

// import 'firebase/firestore';

export default function ChatScreen({ user, route }) {
  const [messages, setMessages] = useState([]);
  const { uid } = route.params;

  const getAllMessages = async () => {
    const docId = uid > user.uid ? `${user.uid}-${uid}` : `${uid}-${user.uid}`;
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const db = firebase.database();
    const myRef = db.ref('chatrooms/' + docId + '/messages');

    myRef.on('value', (snapshot) => {
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        messages.push({
          ...message,
        });
      });

      //const sortedMessages = messages.sort((a, b) => b.createdAt - a.createdAt);

      // Step 1: Parse createdAt strings into Date objects
      for (let message of messages) {
        message.createdAt = moment(message.createdAt);
      }

      // Step 2: Sort messages in descending order based on Date objects
      const sortedMessages = messages.sort(
        (a, b) => b.createdAt.valueOf() - a.createdAt.valueOf()
      );

      // Step 3: Convert sorted messages back to the original format
      for (let message of sortedMessages) {
        message.createdAt = message.createdAt.format('YYYY-MM-DD HH:mm:ss');
      }
      console.log(sortedMessages);
      setMessages(sortedMessages);
    });
  };
  //console.log(messages);
  useEffect(() => {
    getAllMessages();
  }, []);

  const onSend = (messageArray) => {
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      createdAt: new Date(),
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, mymsg)
    );
    const docId = uid > user.uid ? `${user.uid}-${uid}` : `${uid}-${user.uid}`;
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const db = firebase.database();
    const myRef = db.ref('chatrooms/' + docId + '/messages'); // Update the path here

    const newMessageRef = myRef.push();
    const newMessageId = newMessageRef.key;

    const newMessage = {
      ...mymsg, 
      createdAt: currentDate,
      messageId: newMessageId, // Add the new ID here
    };

    newMessageRef.set(newMessage);
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <GiftedChat
        messages={messages}
        onSend={(text) => onSend(text)}
        user={{
          _id: user.uid,
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: 'green',
                },
                left: {
                  backgroundColor: 'white',
                },
              }}
            />
          );
        }}
        renderInputToolbar={(props) => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{ borderTopWidth: 1.5, borderTopColor: 'green' }}
              textInputStyle={{ color: 'black' }}
            />
          );
        }}
      />
    </View>
  );
}
