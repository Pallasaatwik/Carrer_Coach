
import { getResume } from '@/actions/Resume'
import React from 'react'
import ResumeBuilder  from './_components/resumebuilder';
const Resume =  async () => {
  const resume=await getResume();
  return (
    <div className="container mx-auto py-6">
        <ResumeBuilder initialContent={resume?.content} />
    </div>
  )
}

export default Resume