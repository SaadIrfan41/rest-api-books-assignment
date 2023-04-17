import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from './lib/auth'

export async function middleware(request: NextRequest) {
  //   const { pathname, origin } = request.nextUrl

  const headersToken = request.headers.get('Authorization')?.split(' ')

  try {
    if (!headersToken) {
      return NextResponse.json(
        { error: { message: 'Token Not Found' } },
        { status: 400 }
      )
    }
    const verifyToken = await verifyAuth(headersToken[1])
    // console.log(verifyToken)
    if (verifyToken?.user) {
      // console.log(verifyToken?.user[0]?.id)
      const id = verifyToken?.user[0]?.id
      const response = NextResponse.next()
      response.cookies.set('clientId', id)
      return response
    }

    return NextResponse.json(
      { error: { message: 'Authentication required' } },
      { status: 401 }
    )
  } catch (error) {
    console.log(error)
  }
}
export const config = {
  matcher: ['/api/orders/:path*'],
}
