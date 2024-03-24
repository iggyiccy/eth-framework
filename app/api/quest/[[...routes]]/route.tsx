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

app.frame("/", (c) => {
  const { buttonValue, inputText, status } = c;
  const option = inputText || buttonValue;
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
            // TODO sign up user or check if user is signed up
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
            {
              "Thanks for signing up! Please cast by @ mentioning the @farchurch bot. You can also check your status by clicking the button below."
            }
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
            // TODO get the status
            style={{
              color: "white",
              fontSize: 60,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            {"Here is your status"}
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
      status != "response" && (
        <Button.Link href="https://github.com/iggyiccy">Info</Button.Link>
      ),
      status === "response" && <Button.Reset>Back</Button.Reset>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
