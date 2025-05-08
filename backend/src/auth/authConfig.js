import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../db/prismaClient.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
          return done(new Error("Email not found in Google profile"), null);
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              provider: "google",
            },
          });
        } else if (user.provider !== "google") {
          user = await prisma.user.update({
            where: { email },
            data: {
              provider: "google",
              name: profile.displayName || user.name,
              profilePicture:
                (profile.photos && profile.photos[0]
                  ? profile.photos[0].value
                  : null) || user.profilePicture,
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
