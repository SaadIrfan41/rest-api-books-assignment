import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db/db'

export async function GET(request: NextRequest) {
  const clientId = request.cookies.get('clientId')?.value
  try {
    // const orders = await db.unsafe('SELECT * FROM "Orders"')
    if (clientId) {
      const orders = await db.unsafe(
        `
  SELECT * FROM "Orders" WHERE "clientId" = $1 LIMIT 1
  `,
        [clientId]
      )
      return NextResponse.json({ Orders: orders }, { status: 200 })
    }
    return NextResponse.json({ Orders: 'Invalid Client ID ' }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 400 })
  }
}
export async function POST(request: NextRequest) {
  const { bookId, customerName } = await request.json()
  const clientId = request.cookies.get('clientId')?.value
  try {
    if (!bookId) {
      throw new Error('Property bookId is required')
    }
    if (!customerName) {
      throw new Error('Property customerName is required')
    }
    console.log(bookId, customerName)
    if (clientId) {
      const client = await db.unsafe(
        `
  SELECT * FROM "Client" WHERE "id" = $1 LIMIT 1
  `,
        [clientId]
      )
      if (client.length === 0) {
        return NextResponse.json(
          { message: 'User ID is Invalid' },
          { status: 404 }
        )
      }
      // console.log(client[0].clientName)
      if (client[0].clientName.toLowerCase() !== customerName.toLowerCase()) {
        return NextResponse.json(
          { message: 'Invalid Customer Name' },
          { status: 404 }
        )
      }

      const book = await db.unsafe(
        `
  SELECT * FROM "Books" WHERE "id" = $1 LIMIT 1
  `,
        [bookId]
      )
      if (book.length === 0) {
        return NextResponse.json(
          { message: 'Book ID is Invalid' },
          { status: 404 }
        )
      }
      const CreatOrderQuery = `
        INSERT INTO "Orders" ( "clientName", "clientId","bookId")
        VALUES ($1, $2, $3)
        RETURNING id
      `
      const createOrder = await db.unsafe(CreatOrderQuery, [
        client[0].clientName,
        clientId,
        bookId,
      ])
      const createRelationShip = `
      SELECT "Orders".*, "Client".*, "Books".*
      FROM "Orders"
      LEFT JOIN "Client" ON "Client"."id" = "Orders"."clientId"
      LEFT JOIN "Books" ON "Books"."id" = "Orders"."bookId"
      WHERE "Orders"."id" = $1
    `
      await db.unsafe(createRelationShip, [createOrder[0].id])

      return NextResponse.json({ orderId: createOrder[0]?.id }, { status: 200 })
      //   const user = await db.unsafe(
    }

    return NextResponse.json(
      { accessToken: 'Invalid Client ID' },
      { status: 400 }
    )
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 400 })
  }
}
