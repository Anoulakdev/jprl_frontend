import { NextResponse } from "next/server";
import axios from "axios";

async function loginAndGetToken() {
  try {
    const loginResponse = await axios.post(
      `${process.env.URL_API}/auth-svc/auth/login`,
      {
        username: process.env.USERNAME_API,
        password: process.env.PASSWORD_API,
      },
    );

    return loginResponse.data.data.accessToken;
  } catch (error: any) {
    console.error("Error during login:", error.message);
    return null;
  }
}

export async function GET(
  req: Request,
  { params }: { params: { code: string } },
) {
  const token = await loginAndGetToken();

  if (!token) {
    return NextResponse.json(
      { message: "Failed to get API token" },
      { status: 500 },
    );
  }

  try {
    const response = await axios.get(
      `${process.env.URL_API}/organization-svc/employee/get?search=${params.code}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const employees = response.data.data?.employees;
    return NextResponse.json({ employees });
  } catch (error: any) {
    console.error("Error fetching employees:", error.message);
    return NextResponse.json(
      { message: "Failed to fetch employees" },
      { status: 500 },
    );
  }
}
