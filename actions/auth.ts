'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/email';

export async function signupAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return { success: false, error: "User with this email already exists" };
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.verificationCode.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });

  console.log(`Verification code for ${email}: ${code}`); // For testing purposes, log the code to the console
  await sendVerificationEmail(email, name, code);

  return { success: true };
}

export async function verifyCodeAction(formData: FormData) {
  const email = formData.get('email') as string;
  const code = formData.get('code') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  const verification = await prisma.verificationCode.findFirst({
    where: { email, code, expiresAt: { gt: new Date() } }
  });

  if (!verification) {
    return { success: false, error: "Invalid or expired code" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  await prisma.verificationCode.delete({ where: { id: verification.id } });

  return { success: true, user };
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = formData.get('email') as string;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Always return success (security best practice)
  if (!user) {
    return { success: true };
  }

  // Delete old tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });

  // Create new token
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

  // Send email (you already have this function)
  await sendPasswordResetEmail(email, user.name || 'User', token);

  return { success: true };
}

export async function resetPasswordAction(formData: FormData) {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;

  if (!token || !password) {
    return { success: false, error: 'Missing data' };
  }

  // Find the token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  // Check if token exists and is not expired
  if (!resetToken || resetToken.expiresAt < new Date()) {
    return { success: false, error: 'Invalid or expired link' };
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Update the user's password
  await prisma.user.update({
    where: { email: resetToken.email },
    data: { password: hashedPassword },
  });

  // Delete the used token (so it can be used only once)
  await prisma.passwordResetToken.delete({
    where: { id: resetToken.id },
  });

  return { success: true };
}