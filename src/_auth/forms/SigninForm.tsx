import * as z from "zod"; // Importing Zod for schema validation
import { useForm } from "react-hook-form"; // Hook for managing form state
import { zodResolver } from "@hookform/resolvers/zod"; // Resolver to integrate Zod with react-hook-form
import { Link, useNavigate } from "react-router-dom"; // React Router for navigation

// Importing UI components for the form
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader"; // Loader component to show during loading states
import { useToast } from "@/components/ui/use-toast"; // Custom toast notification

import { SigninValidation } from "@/lib/validation"; // Import the validation schema for sign-in form
import { useSignInAccount } from "@/lib/react-query/queries"; // Custom hook for sign-in API request
import { useUserContext } from "@/context/AuthContext"; // Custom hook for accessing authentication context

const SigninForm = () => {
  const { toast } = useToast(); // To display toast notifications
  const navigate = useNavigate(); // Hook for navigating to different routes
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext(); // Hook to check if user is authenticated

  // Query for sign-in process
  const { mutateAsync: signInAccount, isLoading } = useSignInAccount();

  // Initializing the form with Zod validation
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation), // Using Zod schema for validation
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle the sign-in process after form submission
  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    const session = await signInAccount(user); // Attempt sign-in with the provided user credentials

    if (!session) {
      toast({ title: "Login failed. Please try again." }); // Show an error toast if login fails
      return;
    }

    const isLoggedIn = await checkAuthUser(); // Check if the user is authenticated after sign-in

    if (isLoggedIn) {
      form.reset(); // Reset the form if sign-in is successful
      navigate("/"); // Navigate to the home page after successful login
    } else {
      toast({ title: "Login failed. Please try again.", }); // Show an error toast if login fails
      return;
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" /> {/* Logo for the application */}

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>
        
        {/* Form submission handler */}
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className="flex flex-col gap-5 w-full mt-4">
          
          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <Button type="submit" className="shad-button_primary">
            {isLoading || isUserLoading ? ( // Show loading state if either query is loading
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Log in" // Show login button text when not loading
            )}
          </Button>

          {/* Link to sign-up page */}
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
