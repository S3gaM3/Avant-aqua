import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  if (query.length < 3) return NextResponse.json({ suggestions: [] });

  const token = process.env.DADATA_TOKEN;
  if (!token) {
    return NextResponse.json({
      suggestions: [
        `${query}, Москва`,
        `${query}, Московская область`,
        `${query}, Санкт-Петербург`,
      ],
    });
  }

  const res = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      query,
      count: 5,
    }),
  });
  if (!res.ok) return NextResponse.json({ suggestions: [] });
  const data = (await res.json()) as { suggestions?: Array<{ value: string }> };
  return NextResponse.json({
    suggestions: (data.suggestions ?? []).map((s) => s.value),
  });
}
