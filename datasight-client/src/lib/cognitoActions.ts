import { redirect } from "next/navigation";
import { useRouter } from 'next/router';
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resendSignUpCode,
  autoSignIn,
  resetPassword,
  confirmResetPassword,
} from "aws-amplify/auth";
import { getErrorMessage } from "@/utils/get-error-message";

export async function handleSignUp(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: String(formData.get("email")),
      password: String(formData.get("password")),
      options: {
        userAttributes: {
          email: String(formData.get("email")),
          name: String(formData.get("name")),
        },
        // optional
        autoSignIn: true,
      },
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect("/auth/confirm-signup");
}

export async function handleSendEmailVerificationCode(
  prevState: { message: string; errorMessage: string },
  formData: FormData
) {
  let currentState;
  try {
    await resendSignUpCode({
      username: String(formData.get("email")),
    });
    currentState = {
      ...prevState,
      message: "Code sent successfully",
    };
  } catch (error) {
    currentState = {
      ...prevState,
      errorMessage: getErrorMessage(error),
    };
  }

  return currentState;
}

export async function handleConfirmSignUp(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: String(formData.get("email")),
      confirmationCode: String(formData.get("code")),
    });

    // Directly proceed to create the user's bucket
    const response = await fetch('/api/createBucket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: formData.get("email"), // Include user info if required
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Bucket creation failed');
    }

    console.log(result.message); // Confirm bucket creation success
  } catch (error) {
    console.error("Sign up or bucket creation error:", error);
    return getErrorMessage(error);
  }

  // Redirect to home after signup and bucket creation
  redirect('/');
}


export async function handleSignIn(
  prevState: string | undefined,
  formData: FormData
) {
  let redirectLink = "/home-page";
  
  try {
    // Sign the user in
    const { isSignedIn } = await signIn({
      username: String(formData.get("email")),
      password: String(formData.get("password")),

    });

    if (!isSignedIn) return getErrorMessage(new Error("Sign-in failed"));

    // Check if the bucket exists and if it is empty
    const bucketName = "datasight-landing";
    const response = await fetch(`/api/checkBucket?bucketName=${bucketName}`, {
      method: "GET",
    });

    if(response.ok) {
      console.log('checked bucket.');
    }

    if (!response.ok) {
      throw new Error("Failed to check bucket status");
    }

    const { isEmpty } = await response.json();

    // Redirect based on whether the bucket is empty
    redirectLink = isEmpty ? "/onboarding" : "/home-page";

  } catch (error) {
    return getErrorMessage(error);
  }

  redirect(redirectLink);
}


export async function handleSignOut() {
  try {
    await signOut();
  } catch (error) {
    console.log(getErrorMessage(error));
  }
}

export async function handleResetPassword(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await resetPassword({ username: String(formData.get("email")) });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect("/auth/reset-password/confirm");
}

export async function handleConfirmResetPassword(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await confirmResetPassword({
      username: String(formData.get("email")),
      confirmationCode: String(formData.get("code")),
      newPassword: String(formData.get("password")),
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect("/");
}