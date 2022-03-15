// UI
// Load name from localstorage
// Add message
// Change name

import { useControls, button } from "leva";
import Peer from "peerjs";
import { useEffect } from "react";
import create from "zustand";

const getName = () => {
  return (
    window.localStorage.getItem("name") ||
    `Guest-${Math.floor(Math.random() * 10000)}`
  );
};

const setName = (value: string) => {
  window.localStorage.setItem("name", value);
};

// const connections = [];

const sendMessage = (m: Message) => {
  // TODO
};

type Message = { author: string; body: string; timestamp: number };

type Store = {
  name: string;
  messages: Message[];
  setName: (name: string) => void;
  sendMessage: (body: string) => void;
  receiveMessage: (message: Message) => void;
};

const useStore = create<Store>((set, get) => ({
  name: getName(),
  messages: [],
  setName: (name) => {
    set({ name });
    setName(name);
  },
  sendMessage: (body) => {
    const newMessage = { author: get().name, body, timestamp: Date.now() };
    set({
      messages: [...get().messages, newMessage],
    });
    sendMessage(newMessage);
  },
  receiveMessage: (message) => {
    set({
      messages: [...get().messages, message],
    });
  },
}));

export type ChatProps = {
  id?: string;
};

const Chat = ({ id }: ChatProps) => {
  const { name, messages, setName, sendMessage } = useStore();

  useEffect(() => {
    const peer = new Peer();

    console.log({ peer, id });

    if (id) {
      // Connect to a peer
      const conn = peer.connect(id);
      conn.on("open", () => {
        console.log("connected to", id);
        conn.send("hi!");
      });
      // conn.on("data", (data) => {
      //   console.log("received", data);
      // });
      // conn.send("hello");
      console.log({ conn });
    } else {
      // Listen to connections
      peer.on("connection", (conn) => {
        conn.on("data", (data) => {
          console.log("received", data);
        });
        conn.on("open", () => {
          console.log("connection opened", conn);
        });
        console.log({ conn });
      });
    }
  }, [id]);

  const [, set] = useControls(() => ({
    name: {
      value: name,
      onChange: (value) => {
        setName(value);
      },
    },
    message: {
      value: "",
      onChange: () => {},
    },
    send: button((get) => {
      const message = get("message");
      sendMessage(message);
      set({ message: "" });
    }),
  }));
  return (
    <div className="p-2">
      <div>Hello {name}</div>
      {messages.map((m) => {
        return (
          <div>
            {m.author}: {m.body}
          </div>
        );
      })}
    </div>
  );
};

export default Chat;
