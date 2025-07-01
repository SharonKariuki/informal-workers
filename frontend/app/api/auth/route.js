// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Simulated admin users - replace with DB lookup in production
        const admins = [
          {
            name: "Sharon Mugure",
            email: "sharon.mugure@strathmore.edu",
            password: "sharonpassword", // replace with hashed password in real apps!
            role: "admin",
          },
          {
            name: "Jamie Kibanya",
            email: "jamie.kibanya@strathmore.edu",
            password: "jamiepassword", // replace with hashed password in real apps!
            role: "admin",
          },
        ];

        const user = admins.find(
          (admin) =>
            admin.email === credentials.email &&
            admin.password === credentials.password
        );

        if (user) {
          // Return the user object (adds to token and session)
          return {
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } else {
          // If no match, return null to trigger error on sign-in page
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
