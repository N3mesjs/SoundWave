import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const range = request.headers.get("range");
    const url = `http://www.youtube.com/watch?v=ZjBLbXUuyWg`;

  } catch (error) {
    return Response.json(
      { message: error.message || "Internal Server Error" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
