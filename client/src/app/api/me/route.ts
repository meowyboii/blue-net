import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const token = req.cookies.get("token")?.value;
    if (!token) {
      // No token found; user is not authenticated
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get(`${baseUrl}/auth/me`, {
      headers: {
        Cookie: `token=${token}`, // Forward the token manually
      },
      withCredentials: true,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error fetching user data");
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
