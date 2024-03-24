/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api/quest",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", async (c) => {
  const { buttonValue, inputText, status, frameData } = c;
  const fid = frameData?.fid;
  const address = frameData?.address;
  const option = inputText || buttonValue;
  let mint;
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
          frame_id: "quest_999999",
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
  const handleSignUp = async () => {
    sendAnalytics();
    const response = await fetch("http://localhost:3000/api/server/signup", {
      method: "POST",
      body: JSON.stringify({ fid: fid, address: address ? address : null }),
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();
      return data.text;
    }
  };
  const getStatus = async () => {
    sendAnalytics();
    const response = await fetch("http://localhost:3000/api/server/getstatus", {
      method: "POST",
      body: JSON.stringify({ fid: fid }),
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();
      // if data.mint is true, set mint to true else set mint to false
      mint = data.mint ? true : false;
      return data.text;
    }
  };
  let signup;
  if (option === "signUp") {
    signup = await handleSignUp();
  }
  let getstatus;
  if (option === "status") {
    getstatus = await getStatus();
  }
  return c.res({
    image:
      option === "signUp" ? (
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
            {signup}
          </div>
        </div>
      ) : option === "status" ? (
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
              fontSize: 40,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            {getstatus}
          </div>
        </div>
      ) : (
        "https://storage.fleek-internal.com/iggyiccy-team-bucket/Thanksgiving-Challenge.png"
      ),
    intents: [
      status != "response" && <Button value="signUp">Sign Up</Button>,
      status != "response" && <Button value="status">My Status</Button>,
      option === "status" && (
        <Button.Link
          href={`https://warpcast.com/~/compose?text=I%20am%20so%20blessed%20to%20be%20a%20part%20of%20the%20Thanksgiving%20Challenge!`}
        >
          Cast Now
        </Button.Link>
      ),
      option === "status" && mint === true && (
        <Button.Mint
          target="eip155:7777777:0x060f3edd18c47f59bd23d063bbeb9aa4a8fec6df:69420"
          // TODO fix the mint target
        >
          Mint Now
        </Button.Mint>
      ),
      status != "response" && (
        <Button.Link href="https://github.com/iggyiccy">Info</Button.Link>
      ),
      status === "response" && <Button.Reset>Back</Button.Reset>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
