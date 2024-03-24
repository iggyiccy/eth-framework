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
        // TODO it should determine by the number of valid cast posted by the user instead of daysLeft
        // TODO check if all the casts are valid
        let validCasts = 4 as number;
        if (validCasts === 5) {
          return NextResponse.json({
            text: `You have completed the quest! Congratulations!`,
            mint: true,
          });
        } else {
          return NextResponse.json({
            text: `
  Start date: ${startDate} \nExpiry date: ${expiryDateString} \nYou have ${validCasts.toString()} valid casts. \n You still have ${daysLeft.toString()} days left to complete the quest.
  `,
          });
        }
      }
    } catch (err) {
      return NextResponse.json({ message: "Internal server error" });
    }
  } else {
    return NextResponse.json({ message: "Invalid request body" });
  }
}
