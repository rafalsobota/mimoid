import { useEffect, useRef } from "react";
import "webrtc-adapter";
// import SimplePeer from "simple-peer";

// console.log(SimplePeer.WEBRTC_SUPPORT);

const RTS = () => {
  const outgoingRef = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    //@ts-ignore
    const p = new window.SimplePeer({
      initiator: window.location.hash === "#1",
      trickle: false,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
        ],
      },
    });

    p.on("error", (err: any) => console.log("error", err));

    p.on("signal", (data: any) => {
      console.log("SIGNAL", JSON.stringify(data));
      outgoingRef.current!.textContent = JSON.stringify(data, null, 2);
    });

    formRef.current!.addEventListener("submit", (ev) => {
      ev.preventDefault();
      p.signal(JSON.parse(incomingRef.current!.value));
    });

    p.on("connect", () => {
      console.log("CONNECT");
      p.send("whatever" + Math.random());
    });

    p.on("data", (data: any) => {
      console.log("data: " + data);
    });
  });

  return (
    <div>
      <div>RTS</div>
      <div ref={outgoingRef}></div>
      <form ref={formRef}>
        <input type="text" ref={incomingRef} />
      </form>
    </div>
  );
};

export default RTS;
