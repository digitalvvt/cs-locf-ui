import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { useLoginMutation } from "@/api/auth/authApi";
import logo from "../../../../public/logo vvt final.png";

const LoginSchema = Yup.object().shape({
  email: Yup.string().when("role", {
    is: (val: string) => val !== "student",
    then: (schema) => schema.email("Enter a valid email address").required("Email is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  registration_number: Yup.string().when("role", {
    is: "student",
    then: (schema) => schema.required("Registration number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string()
    .oneOf(["student", "faculty", "hod", "principal", "admin"])
    .required("Role is required"),
});

const EmailLoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (
    values: { email: string; registration_number: string; password: string; role: string },
    { setSubmitting, setErrors, validateForm }: any
  ) => {
    try {
      const payload =
        values.role === "student"
          ? {
              registration_number: values.registration_number,
              password: values.password,
              role: values.role,
            }
          : {
              email: values.email,
              password: values.password,
              role: values.role,
            };

      const response = await login(payload).unwrap();

      if (response.accessToken) {
        localStorage.setItem("authToken", response.accessToken);
        if (response.user.subjectIds) {
          localStorage.setItem("subjectIds", response.user.subjectIds);
        }
        localStorage.setItem("userDetails", JSON.stringify(response.user));
        window.dispatchEvent(new Event("storage"));

        toast({
          title: "Login Successful",
          description: `Welcome back, Dear!`,
        });

        setTimeout(() => {
          navigate("/", { replace: true });
          window.location.reload();
        }, 500);
      }
    } catch (error: any) {
      console.log("error", error);
      toast({
        title: "Login Failed",
        description: error?.data?.message || "Invalid email or passwodhgeherrd",
        variant: "destructive",
      });
      setSubmitting(false); // re-enable form submit
      validateForm(); // re-check isValid after error
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mt-[100px]">
      <div className="flex items-center justify-center ">
        <img src={logo} alt="LOCF Logo" className="h-[39px] w-[245px] object-contain" />
      </div>
      <Formik
        initialValues={{ email: "", registration_number: "", password: "", role: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ isValid, setFieldValue, values, isSubmitting }) => (
          <Form className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {values.role === "student"
                  ? "Sign in with your registration number and password"
                  : "Sign in with your email and password"}
              </p>
            </div>
            {/* ✅ Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Role
              </Label>
              <RadioGroup
                value={values.role}
                onValueChange={(val) => setFieldValue("role", val)}
                className="flex flex-wrap gap-4"
              >
                {["admin", "principal", "hod", "faculty", "student"].map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <RadioGroupItem value={role} id={role} />
                    <Label htmlFor={role} className="capitalize">
                      {role}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <ErrorMessage name="role">
                {(msg) => <p className="text-sm text-red-500 mt-1">{msg}</p>}
              </ErrorMessage>
            </div>

            <div className="space-y-4">
              {values.role === "student" ? (
                <div className="space-y-2">
                  <Label
                    htmlFor="registration_number"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Registration Number
                  </Label>
                  <Field
                    as={Input}
                    type="text"
                    name="registration_number"
                    id="registration_number"
                    placeholder="Enter your registration number"
                    className="h-11 focus-visible:ring-2 focus-visible:ring-primary/50"
                  />
                  <ErrorMessage name="registration_number">
                    {(msg) => <p className="text-sm text-red-500 mt-1">{msg}</p>}
                  </ErrorMessage>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email Address
                  </Label>
                  <Field
                    as={Input}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="you@example.com"
                    className="h-11 focus-visible:ring-2 focus-visible:ring-primary/50"
                    autoComplete="email"
                  />
                  <ErrorMessage name="email">
                    {(msg) => <p className="text-sm text-red-500 mt-1">{msg}</p>}
                  </ErrorMessage>
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </Label>
                <Field
                  as={Input}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="h-11 focus-visible:ring-2 focus-visible:ring-primary/50"
                  autoComplete="current-password"
                />
                <ErrorMessage name="password">
                  {(msg) => <p className="text-sm text-red-500 mt-1">{msg}</p>}
                </ErrorMessage>
              </div>

              {/* <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white"
                disabled={isLoading || !isValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button> */}
              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white"
                disabled={isSubmitting || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EmailLoginForm;
