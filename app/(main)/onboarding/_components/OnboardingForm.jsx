// "use client";
// import React, { useEffect, useState } from 'react'
// import {set, useForm} from "react-hook-form";
// import {zodResolver} from "@hookform/resolvers/zod";
// import { onboardingSchema } from '@/app/lib/schema';
// import { useRouter } from 'next/navigation';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Textarea } from '@/components/ui/textarea';
// import { Button } from '@/components/ui/button';
// import useFetch from '@/hooks/use-fetch';
// import { updateUser } from '@/actions/user';
// import { toast } from 'sonner';
// import { Loader2 } from 'lucide-react';

// const OnboardingForm = ({industries}) => {

  
//   const [selectedIndustry,setSelectedIndustry]=useState(null);
//   const router =useRouter();
//   const {loading:updateLoading,fn:updateUserFn,data:updateResult}=useFetch(updateUser);
//   const {register,handleSubmit ,formState:{errors},setValue,watch,}=useForm({
//     resolver:zodResolver(onboardingSchema),
//   });
//   const watchIndustry=watch("industry");
//   const  onSubmit= async (values)=>{
//     try{
//       console.log(values)
//       const formattedIndustry=`${values.industry}-${values.subIndustry
//         .toLowerCase()
//         .replace(/  /g,"-")}`;
  
//         await updateUserFn({
//           ...values,
//           industry:formattedIndustry,
//         });
//       }
//       catch(error){
//         console.error("onboarding error",error);
  
//       }
//     };
   
//   useEffect(()=>{
//     if(updateResult?.success && !updateLoading){
//       toast.success("Profile Updated Successfully");
//       router.push("/dashboard");
//       router.refresh();
//     }
//   },[updateResult,updateLoading]);
//   return (
//     <div className="flex items-center justify-center bg-background">
//       <Card className="w-full max-w-lg mt-10 mx-2">
//         <CardHeader>
//           <CardTitle className="text-4xl">Complete  Your Profile</CardTitle>
//           <CardDescription>Select your industry  to get personalized career insights and recommendation </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//           <div className="space-y-2">
//           <Label htmlFor="industry">Industry</Label>
//           <Select onValueChange={(value)=>{
//             setValue("industry",value);
//             setSelectedIndustry(industries.find((ind)=> ind.id ===value));
//             setValue("subIndustry","");
//           }} >
//             <SelectTrigger id="industry">
//               <SelectValue placeholder="Select an industry" />
//             </SelectTrigger>
//             <SelectContent>
//               {industries.map((ind)=>{
//                 return  <SelectItem value={ind.id} key={ind.id}>{ind.name}</SelectItem>
//               })}

//             </SelectContent>
//           </Select>
//           {errors.industry &&(
//             <p className="text-sm text-red-500">{errors.industry.message}</p>
//           )}
//           </div>
//           {watchIndustry && (<div className="space-y-2">
//           <Label htmlFor="subIndustry">Specialization</Label>
//           <Select onValueChange={(value)=>{
//             setValue("subIndustry",value);
//           }} >
//             <SelectTrigger id="subIndustry">
//               <SelectValue placeholder="Select an industry" />
//             </SelectTrigger>
//             <SelectContent>
//               {selectedIndustry?.subIndustries.map((ind)=>{
//                 return  <SelectItem value={ind} key={ind}>{ind}</SelectItem>
//               })}

//             </SelectContent>
//           </Select>
//           {errors.subIndustry &&(
//             <p className="text-sm text-red-500">{errors.subIndustry.message}</p>
//           )}
//           </div>)}
//           <div className="space-y-2">
//           <Label htmlFor="experience">Years of Experience</Label>
//           <Input id="experience"
//           type="number" min="0" max="50" placeholder="Enter years of experience" {... register("experience")}/>
//           {errors.experience &&(
//             <p className="text-sm text-red-500">{errors.experience.message}</p>
//           )}
//           </div>
//           <div className="space-y-2">
//           <Label htmlFor="skills">skills</Label>
//           <Input id="skills"
//            placeholder="Eg., Python ,JavaScript ,Project Management" {... register("skills")}/>
//           <p className="test-sm text-muted-foreground">Separate multiple skills with commas</p>
//           {errors.skills &&(
//             <p className="text-sm text-red-500">{errors.skills.message}</p>
//           )}
//           </div>
//           <div className="space-y-2">
//           <Label htmlFor="bio">Professional Bio</Label>
//           <Textarea id="bio"
//            placeholder="Tell us about your professional background" className="h-32" {... register("bio")}/>
          
//           {errors.bio &&(
//             <p className="text-sm text-red-500">{errors.bio.message}</p>
//           )}
//           </div>
//           <Button className="w-full" type="submit" disabled={updateLoading}>
            
//             {updateLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
//                 Saving...
//               </> ): (
//               "Complete Profile" )}
//               </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default OnboardingForm
"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from '@/app/lib/schema';
import { useRouter } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { updateUser } from '@/actions/user';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const OnboardingForm = ({ industries }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const router = useRouter();
  const { loading: updateLoading, fn: updateUserFn, data: updateResult } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const watchIndustry = watch("industry");

  const onSubmit = async (values) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.error("onboarding error", error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile Updated Successfully");
      router.push("/recommended-jobs"); // 👈 redirected here
      // router.push(`/recommended-jobs?userId=${result.updatedUser.id}`);
      router.refresh();
    }
  }, [updateResult, updateLoading]);

  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          <CardTitle className="text-4xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Select your industry to get personalized career insights and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(industries.find((ind) => ind.id === value));
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem value={ind.id} key={ind.id}>
                      {ind.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">{errors.industry.message}</p>
              )}
            </div>

            {/* Sub-Industry */}
            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("subIndustry", value);
                  }}
                >
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select a specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIndustry?.subIndustries.map((ind) => (
                      <SelectItem value={ind} key={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">{errors.subIndustry.message}</p>
                )}
              </div>
            )}

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">{errors.experience.message}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="Eg., Python, JavaScript, Project Management"
                {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas
              </p>
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background"
                className="h-32"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button className="w-full" type="submit" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
