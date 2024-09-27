import { redirect } from "next/navigation";
import {
	signUp,
	confirmSignUp,
	signIn,
	signOut,
	resendSignUpCode,
	fetchAuthSession,
} from "aws-amplify/auth";
import { getErrorMessage } from "@/utils/get-error-message";

export async function handleSignUp(
	prevState: string | undefined,
	formData: FormData,
) {
	try {
		const { isSignUpComplete, userId, nextStep } =
			await signUp({
				username: String(formData.get("email")),
				password: String(formData.get("password")),
				options: {
					userAttributes: {
						email: String(formData.get("email")),
						given_name: String(formData.get("given_name")),
						family_name: String(
							formData.get("family_name"),
						),
					},
					// optional
					autoSignIn: true,
				},
			});
	} catch (error) {
		return getErrorMessage(error);
	}
	redirect("./confirm-signup");
}

export async function handleSendEmailVerificationCode(
	prevState: { message: string; errorMessage: string },
	formData: FormData,
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
		const { isSignUpComplete, nextStep } =
			await confirmSignUp({
				username: String(formData.get("email")),
				confirmationCode: String(formData.get("code")),
			});
	} catch (error) {
		return getErrorMessage(error);
	}
	redirect("./login");
}

export async function handleSignIn(
  prevState: string | undefined,
  formData: FormData,
) {
  let redirectLink = "/home-page"; // Default redirect link after successful sign-in

  try {
    const { isSignedIn, nextStep } = await signIn({
      username: String(formData.get("email")),
      password: String(formData.get("password")),
    });

    const session = await fetchAuthSession();
    console.log("Session:", session);
    console.log(isSignedIn, nextStep);

    // Handle password reset requirement
    if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
      // User needs to reset their password
      sessionStorage.setItem('userChallenge', JSON.stringify(session));
      redirectLink = "/auth/reset-password"; // Redirect to reset password page
    } else if (isSignedIn) {
      // If user is signed in without any additional steps
      redirectLink = "/dashboard"; // Redirect to dashboard or any other default page
    }
  } catch (error) {
    return getErrorMessage(error); // Handle any errors that occur during sign-in
  }

  // Perform the redirect after handling sign-in steps
  window.location.href = redirectLink;
}


export async function handleSignOut() {
	try {
		await signOut();
	} catch (error) {
		console.log(getErrorMessage(error));
	}
	redirect("/login");
}
