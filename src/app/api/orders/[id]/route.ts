import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../../db/db'

type Props = {
  params: {
    id?: string
  }
}

export async function GET(request: NextRequest, { params }: Props) {
  const id = params?.id
  try {
    if (id) {
      const query = `
  SELECT o.*, c.*, b.*
  FROM "Orders" o
  LEFT JOIN "Client" c ON o."clientId" = c."id"
  LEFT JOIN "Books" b ON o."bookId" = b."id"
  WHERE o."id" = $1
`

      const values = [id]
      const order = await db.unsafe(query, values)
      console.log(order)
      if (order.length === 0) {
        return NextResponse.json(
          { message: 'Invalid order ID' },
          { status: 404 }
        )
      }
      return NextResponse.json({ order: order }, { status: 200 })
    }
    return NextResponse.json(
      { message: 'Book ID is Required' },
      { status: 404 }
    )
    // const books = await db.unsafe<Book[]>('SELECT * FROM "Books"')
    // return NextResponse.json({ books: books }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 400 })
  }
}
export async function PATCH(request: NextRequest, { params }: Props) {
  const id = params?.id
  const { customerName } = await request.json()
  const clientId = request.cookies.get('clientId')?.value
  try {
    if (!customerName) {
      throw new Error('Property customerName is required')
    }
    if (clientId) {
      await db.unsafe('UPDATE "Orders" SET "clientName" = $1 WHERE "id" = $2', [
        customerName,
        id,
      ])

      // Update the clientName in the Client table
      await db.unsafe('UPDATE "Client" SET "clientName" = $1 WHERE "id" = $2', [
        customerName,
        clientId,
      ])
      return NextResponse.json(
        { Order: 'Updated Successfully' },
        { status: 200 }
      )
    }
    return NextResponse.json(
      { accessToken: 'Invalid Client ID' },
      { status: 404 }
    )
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 400 })
  }
}
export async function DELETE(request: NextRequest, { params }: Props) {
  const id = params?.id
  try {
    if (id) {
      const order = await db.unsafe(
        `
  SELECT * FROM "Orders" WHERE "id" = $1 LIMIT 1
  `,
        [id]
      )
      if (order.length === 0) {
        return NextResponse.json(
          { message: 'Order ID not Found' },
          { status: 404 }
        )
      }

      await db.unsafe('DELETE FROM "Orders" WHERE "id" = $1', [id])

      return NextResponse.json(
        { Order: 'Deleted Successfully' },
        { status: 200 }
      )
    }
    return NextResponse.json(
      { accessToken: 'Invalid Order ID' },
      { status: 404 }
    )
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 400 })
  }
}
