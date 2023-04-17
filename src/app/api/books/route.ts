import { NextResponse } from 'next/server'
import { db } from '../../../../db/db'

interface Book {
  id: number
  name: string
  type: string
  available: boolean
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const type = searchParams.get('type')
  const limit = searchParams.get('limit')
  console.log(type, limit)
  try {
    let query = 'SELECT * FROM "Books"'

    if (type) {
      query += ` WHERE type = '${type}'`
    }

    if (limit) {
      query += ` LIMIT ${limit}`
    }

    const books = await db.unsafe<Book[]>(query)

    return NextResponse.json({ books: books }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 400 })
  }
}
export async function POST(request: Request) {
  const { name, type, available } = await request.json()

  try {
    if (!name) {
      throw new Error('Property name  is required')
    }
    if (!type) {
      throw new Error('Property type is required')
    }

    if (typeof available !== 'boolean') {
      throw new Error('Property avaliable is required')
    }
    const createbook = await db.unsafe(
      'INSERT INTO "Books" ("id", "name", "type","available") VALUES (uuid_generate_v4(), $1, $2,$3) RETURNING *',
      [name, type, available]
    )
    return NextResponse.json({ book: createbook }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 400 })
  }
}
