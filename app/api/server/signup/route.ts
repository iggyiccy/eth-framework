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
      // check from the database "farchurch-5-day-quest" if the user fid already exists and the expiry_at is not yet reached
      var currentTimestamp = new Date().toISOString();
      const { data: existingData, error: existingError } = await supabase
        .from("farchurch-5-day-quest")
        .select("*")
        .eq("fid", body?.fid)
        .gte("expiry_at", currentTimestamp);
      if (existingError) {
        return NextResponse.json({ text: existingError.message });
      } else if (existingData.length > 0) {
        return NextResponse.json({
          text: `You have already signed up! Please cast by @ mentioning the @farchurch bot. You can also check your status by clicking the button below.`,
        });
      } else {
        // insert the user's fid and address to the database "farchurch-5-day-quest" if the user does not exist
        const { data, error } = await supabase
          .from("farchurch-5-day-quest")
          .insert({
            fid: body?.fid,
            address: body?.address ? body?.address : null,
          })
          .select();
        if (error) {
          return NextResponse.json({ text: error.message });
        } else if (data) {
          console.log(data);
          return NextResponse.json({
            text: `Thanks for signing up! Please cast by @ mentioning the @farchurch bot. You can also check your status by clicking the button below.`,
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
