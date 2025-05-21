import { getAssessments } from '@/actions/interview'
import React from 'react'
import StatsCards from './_components/statscards';
import QuizList from './_components/QuizList';
import PerformanceCard from './_components/PerformanceCard';
const Interview = async  () => {
  const assessments=await getAssessments();
  return (
    <div>
      <div>
        <h1 className="text-6xl font-bold gradient-title mb-5">Interview Preparation</h1>
        <div>
          <StatsCards assessments={assessments}/>
          <PerformanceCard assessments={assessments}/>
          <QuizList assessments={assessments}/>
        </div>
      </div>
    </div>
  )
}

export default Interview