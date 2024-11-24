import { redirect } from "next/navigation";
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
  formData: FormData
) {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: String(formData.get("email")),
      confirmationCode: String(formData.get("code")),
    });
    await autoSignIn();
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect("/");
}

export async function handleSignIn(
  prevState: string | undefined,
  formData: FormData
) {
  const redirectToOnboarding = '/onboarding';
  const redirectToDashboard = '/dashboard/resources';
  let isSignedIn = false;
  let isBucketEmpty = false;

  try {
    // Perform the sign-in process
    const { isSignedIn: signedIn, nextStep } = await signIn({
      username: String(formData.get("email")),
      password: String(formData.get("password")),
    });
    isSignedIn = signedIn;

    // If signed in successfully, check if the bucket is empty
    if (isSignedIn) {
      const checkBucketResponse = await fetch('/api/checkBucket');

      if (!checkBucketResponse.ok) {
        // Log the response in case of issues
        const errorDetails = await checkBucketResponse.json();
        console.error('Failed to check S3 bucket:', errorDetails);
        throw new Error(`Error checking S3 bucket: ${errorDetails.error}`);
      }

      // Properly await and handle the JSON response
      const responseData = await checkBucketResponse.json();
      console.log('Bucket check response:', responseData);

      // Extract the `isEmpty` field
      isBucketEmpty = responseData.isEmpty;
    }
  } catch (error) {
    console.error('Error during sign-in or bucket check:', error);
    return getErrorMessage(error);
  }

  // Redirect based on the bucket status
  if (isSignedIn) {
    if (isBucketEmpty) {
      console.log('Route to onboarding');
      redirect(redirectToOnboarding);
    } else {
      console.log('Route to resource dashboard');
      redirect(redirectToDashboard);
    }
  }
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
