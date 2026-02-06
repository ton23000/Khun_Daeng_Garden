import NextAuth from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { Session, User } from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            name: "Phone",
            credentials: {
                phone: { label: "Phone", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { phone: credentials.phone as string }
                })

                if (!user || !user.password) {
                    return null
                }

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isValid) {
                    return null
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image || null,
                    role: user.role
                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User | any }) {
            if (user) {
                token.id = user.id
                token.role = user.role || 'USER'
            }
            return token
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                (session.user as any).id = token.id as string
                (session.user as any).role = token.role as string
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
    }
})
