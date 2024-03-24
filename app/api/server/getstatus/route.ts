import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../supabase";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export async function POST(req: NextRequest) {
  if (typeof req.body === "object" && req.body !== null) {
    const body = await req.json();
    const checkValidCast = async () => {
      let validCasts = 0;
      try {
        const response = await fetch(
          `https://api.pinata.cloud/v3/farcaster/casts?fid=${body?.fid}`,
          // `https://api.pinata.cloud/v3/farcaster/casts?fid=384103`, // for testing
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
          }
        );
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.json();
          const casts = data.data.casts;
          casts?.forEach((cast: any) => {
            if (
              cast.root_parent_url === process.env.FARCASTER_PARENT_URL ||
              cast.parent_url === process.env.FARCASTER_PARENT_URL
            ) {
              console.log(cast);
              validCasts++;
            }
          });
        }
      } catch (err) {
        console.error(err);
      }
      return validCasts;
    };
    try {
      // check from the database "farchurch-5-day-quest" if the user fid already exists and return the start date, expiry date, and days left
      var currentTimestamp = new Date().toISOString();
      var currentTime = new Date();
      const { data: existingData, error: existingError } = await supabase
        .from("farchurch-5-day-quest")
        .select("*")
        .eq("fid", body?.fid)
        .gte("expiry_at", currentTimestamp);
      if (existingError) {
        return NextResponse.json({ text: existingError.message });
      } else if (existingData.length > 0) {
        const startDate = new Date(existingData[0].created_at).toLocaleString();
        const expiryDate = new Date(
          (existingData[0] as { expiry_at: string }).expiry_at
        );
        const expiryDateString = expiryDate.toLocaleString();
        const daysLeft = Math.ceil(
          (expiryDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24)
        );
        const validCasts = await checkValidCast();
        // let validCasts = 4 as number;
        if (validCasts >= 5) {
          return NextResponse.json({
            text: `You have completed the quest! Congratulations!`,
            mint: true,
          });
        } else if (validCasts < 5) {
          return NextResponse.json({
            text: `
  Start date: ${startDate} \nExpiry date: ${expiryDateString} \nYou have ${validCasts.toString()} valid casts. \n You still have ${daysLeft.toString()} days left to complete the quest.
  `,
          });
        } else {
          return NextResponse.json({
            text: `You have not signed up yet! Please sign up again.`,
          });
        }
      }
    } catch (err) {
      return NextResponse.json({ text: "Internal server error" });
    }
  } else {
    return NextResponse.json({ text: "Invalid request body" });
  }
}
