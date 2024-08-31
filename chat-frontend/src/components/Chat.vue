<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMutation, useSubscription } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const SEND_MESSAGE = gql`
  mutation SendMessage($messageInput: MessageInput!) {
    sendMessage(messageInput: $messageInput)
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription {
    messageReceived {
      content
    }
  }
`;

export default defineComponent({
  setup() {
    const message = ref('');
    const messages = ref<{ content: string; }[]>([]);

    const { mutate, onError: onMutateError } = useMutation(SEND_MESSAGE, {
      onError: (error) => {
        console.error("Mutation error:", error.message);
      },
    });

    useSubscription(MESSAGE_SUBSCRIPTION, {
      onResult: (result) => {
        if (result.data && result.data.messageReceived) {
          messages.value.push(result.data.messageReceived);
        }
      },
      onError: (error) => {
        console.error("Subscription error:", error.message);
      },
    });


    const sendMessage = async () => {
      try {
        await mutate({ messageInput: { content: message.value } });
        message.value = '';
      } catch (error) {
        console.error("Mutation error:", error.message);
      }
    };

    return { message, sendMessage, messages };
  },
});
</script>

<template>
  <div>
    <input v-model="message" placeholder="Type a message" />
    <button @click="sendMessage">Send</button>
    <div v-for="(msg, index) in messages" :key="index">
      <p>{{ msg.content }}</p>
    </div>
  </div>
</template>
