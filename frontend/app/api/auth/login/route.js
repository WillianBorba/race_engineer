import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();

  let backendRes;
  try {
    backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível conectar ao servidor.' },
      { status: 503 }
    );
  }

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(
      { error: data.error || 'Erro ao fazer login.' },
      { status: backendRes.status }
    );
  }

  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set('token', data.token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
