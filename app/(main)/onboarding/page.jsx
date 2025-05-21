import React from 'react'
import { getUserOnboardingStatus } from '@/actions/user';
import {industries} from "@/data/industries"
import  {redirect} from "next/navigation";
import OnboardingForm from './_components/OnboardingForm';
const OnboardingPage = async () => {
  const {isOnboarded}=await getUserOnboardingStatus();
  // if(isOnboarded){
  //   redirect("/dashboard")
  // }
  return (
    <main>
        <OnboardingForm industries={industries}/>
    </main>
  )
}

export default OnboardingPage
