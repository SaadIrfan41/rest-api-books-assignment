// import { NextResponse } from 'next/server'
// import { db } from '../../../../db/db'

// export async function GET(request: Request) {
//   try {
//     //   const book = await db.unsafe(
//     //     `
//     // ALTER TABLE "Orders" DROP COLUMN "booksId"

//     // `
//     //   )
//     const book = await db.unsafe(
//       `
//     DROP TABLE "Books","Client","Orders"
//     `
//     )
//     if (book.length === 0) {
//       return NextResponse.json({ message: 'Book Not Found' }, { status: 404 })
//     }
//     return NextResponse.json({ book: book }, { status: 200 })

//     // const books = await db.unsafe<Book[]>('SELECT * FROM "Books"')
//     // return NextResponse.json({ books: books }, { status: 200 })
//   } catch (e: any) {
//     return NextResponse.json({ message: e.message }, { status: 400 })
//   }
// }
