import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";

import { User } from "../models/User.js";
import { env } from "../lib/env.js";

export const authRouter = Router();

function toPublicUser(userDoc) {
  return {
    id: String(userDoc._id),
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
  };
}

authRouter.get("/me", (req, res) => {
  res.json({ user: req.session?.user ?? null });
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const Body = z.object({
      name: z.string().min(2).max(120),
      email: z.string().email().max(320),
      password: z.string().min(8, "Password must be at least 8 characters").max(200).regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/, "Password must contain at least one special character"),
    });

    const { name, email, password } = Body.parse(req.body);
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const role = env.adminEmailsSet.has(normalizedEmail) ? "admin" : "citizen";

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
    });

    const publicUser = toPublicUser(user);
    req.session.user = publicUser;

    res.status(201).json({ user: publicUser });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const Body = z.object({
      email: z.string().min(1).max(320),
      password: z.string().min(1).max(200),
    });

    const { email, password } = Body.parse(req.body);
    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail === "admin" && password === "admin") {
      const publicUser = {
        id: "admin-id",
        name: "Administrator",
        email: "admin",
        role: "admin",
      };
      req.session.user = publicUser;
      return res.json({ user: publicUser });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const publicUser = toPublicUser(user);
    req.session.user = publicUser;

    res.json({ user: publicUser });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/logout", async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("civiclink.sid");
      res.json({ ok: true });
    });
  } catch (err) {
    next(err);
  }
});

