/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { useState } from "react";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api/verses",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", async (c) => {
  const { buttonValue, inputText, status, frameData } = c;
  const option = inputText || buttonValue;
  const sendAnalytics = async () => {
    const response = await fetch(
      "https://api.pinata.cloud/farcaster/frames/interactions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            trustedData: {},
            untrustedData: {
              buttonIndex: frameData?.buttonIndex,
              fid: frameData?.fid,
              messageHash: frameData?.messageHash,
              timestamp: frameData?.timestamp,
            },
          },
          frame_id: "verses_999999",
        }),
      }
    );
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();
      return data.text;
    }
  };
  const getBibleVerse = async () => {
    sendAnalytics();
    const response = await fetch("https://bible-api.com/?random=verse");
    const data = await response.json();
    return data.text;
  };
  const verse = await getBibleVerse();
  return c.res({
    image:
      option === "get" ? (
        <div
          style={{
            alignItems: "center",
            background: "linear-gradient(to right, blue, purple)",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 50,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            {verse}
          </div>
        </div>
      ) : (
        "https://storage.fleek-internal.com/iggyiccy-team-bucket/farchurch-daily-verses.png"
      ),
    intents: [
      // <TextInput placeholder="Enter custom fruit..." />,
      <Button value="get">Get Your Daily Verses</Button>,
      status != "response" && (
        <Button.Link href="https://github.com/iggyiccy">Info</Button.Link>
      ),
      status === "response" && (
        <Button.Mint
          target="eip155:7777777:0x060f3edd18c47f59bd23d063bbeb9aa4a8fec6df:69420" // TODO fix the mint target
        >
          Mint
        </Button.Mint>
      ),
      status === "response" && (
        <Button.Link
          href={`https://warpcast.com/~/compose?text=𓆩⚝𓆪%20This%20bible%20verses%20light%20my%20day%20: ̗̀➛%20${verse}`}
        >
          Cast
        </Button.Link>
      ),
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
