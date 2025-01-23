"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
// import { useRouter } from "next/navigation"
import OtpModal from "../OtpModal"
import { checkUser, createUser, storeOtp } from "@/lib/actions/patient.actions"

export enum  FormFieldType {
    INPUT = 'input',
    CHECKBOX = "checkbox",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton"
}
 
const PatientForm = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] =  useState<{ phone: string; userId: string; email: string }>({
    phone: '',
    userId: '',
    email: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  // const router = useRouter();

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    },
  })

  const handleGetStarted = (phone: string, userId: string, email: string) => {
    setIsModalOpen(false);  
    setTimeout(() => {
      setUserData({phone, userId, email});
      setIsModalOpen(true);
    }, 100);
  };
 
  async function onSubmit(values: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    try {
      const usersData = { name: values.name, email: values.email, phone: values.phone };
      const user = await checkUser(values.email);
      if(user){
        const otp = await storeOtp(user.$id, values.email);
        if(otp){
          handleGetStarted(user.phone, user.$id, values.email);
        }
      } else {
        const newUser = await createUser(usersData);
        if(newUser){
          const otp = await storeOtp(newUser.$id, values.email);
          if(otp){
            handleGetStarted(values.phone, newUser.$id, values.email);
          }
        } else {
          setError('Either the email or phone number is already in use. Please check and try again.');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header">Hi there 👋</h1>
            <p className="text-dark-700">Schedule your first appointment.</p>
        </section>
        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />

        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@email.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
        />

        <CustomFormField 
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="(555) 123-4567"
        />

        <SubmitButton isLoading={isLoading}>
            Get Started
        </SubmitButton>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </Form>
    {isModalOpen && <OtpModal data={userData} />}
    </>
  )
}

export default PatientForm