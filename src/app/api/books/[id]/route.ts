import { NextResponse } from 'next/server'
import { db } from '../../../../../db/db'

interface Book {
  id: number
  name: string
  type: string
  available: boolean
}

type Props = {
  params: {
    id?: string
  }
}

export async function GET(request: Request, { params }: Props) {
  const id = params?.id
  try {
    if (id) {
      const book = await db.unsafe(
        `
  SELECT * FROM "Books" WHERE "id" = $1 LIMIT 1
  `,
        [id]
      )
      if (book.length === 0) {
        return NextResponse.json({ message: 'Book Not Found' }, { status: 404 })
      }
      return NextResponse.json({ book: book }, { status: 200 })
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
