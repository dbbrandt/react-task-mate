import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {
        // Your GET logic here
        return NextResponse.json({ message: "Get: Hello from Next.js" }, { status: 200 });
    } catch (error) {
        console.error("GET request error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        // Your POST logic here

        return NextResponse.json({ message: "Post: Hello from Next.js" }, { status: 200 });
    } catch (error) {
        console.error("POST request error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}