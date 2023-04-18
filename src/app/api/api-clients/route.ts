import { NextResponse } from 'next/server'

import { SignJWT } from 'jose'
import { getJWTSecretKey } from '@/lib/auth'
import { db } from '../../../../db/db'

interface User {
  id: number
  name: string
  type: string
  available: boolean
}

export async function POST(request: Request) {
  const { clientName, clientEmail } = await request.json()

  try {
    if (!clientName) {
      throw new Error('Property clientName is required')
    }
    if (!clientEmail) {
      throw new Error('Property clientEmail is required')
    }

    const user = await db.unsafe(
      `
  SELECT * FROM "Client" WHERE "clientEmail" = $1 LIMIT 1
  `,
      [clientEmail]
    )

    console.log('USER FOUND', user)

    if (user.length === 0) {
      const createUser = await db.unsafe(
        'INSERT INTO "Client" ("clientName", "clientEmail") VALUES ($1, $2) RETURNING *',
        [clientName, clientEmail]
      )
      console.log('NEW USER', createUser)
      if (createUser.length === 0) {
        throw new Error('CanNot INSERT New CLient')
      }
      const jwt = await new SignJWT({
        user: createUser,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(new TextEncoder().encode(getJWTSecretKey()))
      const response = NextResponse.next()

      response.headers.set('Authorization', 'Bearer ' + jwt)

      return NextResponse.json({ accessToken: jwt }, { status: 200 })
    }
    const jwt = await new SignJWT({
      user: user,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(getJWTSecretKey()))

    const response = NextResponse.next()

    response.headers.set('Authorization', 'Bearer ' + jwt)

    return NextResponse.json({ accessToken: jwt }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 400 })
  }
}
