import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
);


export async function POST(req: Request) {
    try{
        const body = await req.json();
        const { name, surname, note } = body;

        if(!name || !surname){
            return NextResponse.json(
                { error: "Name and Surname are required" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("guests")
            .insert({ name, surname, note});
        
        if( error ) {
            console.error("Supabase insert error:", error);
            return NextResponse.json(
                { error: "Database error" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success:true }
        );
    }
    catch (errr){
        console.error("API error:", errr);
        return NextResponse.json(
            { error: "Invalid request"},
            { status: 400}
        );
    }
}