"use client"
import { generateQuiz, saveQuizResult } from '@/actions/interview';
import useFetch from '@/hooks/use-fetch';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from 'lucide-react';
// import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

import QuizResult from "./quiz-result";
  

const quiz = () => {
    const [currentQuestion,setCurrentQuestion]=useState(0);
    const [answers,setAnswers]=useState([]);
    const [showExplanation,setshowExplanation]=useState(false);

    const { loading: generatingQuiz,
        fn:generateQuizFn,
        data:quizData,
    }=useFetch(generateQuiz);
    const { loading: savingResult,
        fn:saveQuizResultFn,
        data:resultData,
        setData:setResultData,  
    }=useFetch(saveQuizResult);
    console.log(resultData)
    useEffect(()=>{
        if(quizData){
            setAnswers(new Array(quizData.length).fill(""));
        }
    },[quizData])
    const handleAnswer=(answer)=>{
        const newAnswers=[...answers];
        newAnswers[currentQuestion]=answer;
        setAnswers(newAnswers)

    }
    const handleNext=()=>{
        if(currentQuestion<quizData.length-1){
            setCurrentQuestion(currentQuestion+1);
            setshowExplanation(false);
        }else{
            finishQuiz();
        }
    }
    const calculateScore=()=>{
        let correct=0;
        answers.forEach((answer,i)=>{
            if(answer=== quizData[i].correctAnswer){
                correct++;
            }
        });
        return (correct/quizData.length)*100;
    };
    const finishQuiz=async ()=>{
        const score=calculateScore();
        try{
            await  saveQuizResultFn(quizData,answers,score);
            toast.success("Quiz Completed");
        }catch(error){
            toast.error(error.message || "Failed to save Quiz results");
        }
    };
    if(generatingQuiz){
        return <BarLoader className="mt-4" width={"100%"} color="gray"/>;
    }
    const startNewQuiz =()=>{
        setCurrentQuestion(0);
        setAnswers([]);
        setshowExplanation(false);
        generateQuizFn();
        setResultData(null);
    }
    if(resultData){
        return (<div className="mx-2">
            <QuizResult result={resultData} onStartNew={startNewQuiz}/>
        </div>)
    }
    if(!quizData){
        return (
            <Card  className="mx-2">
                <CardHeader>
                    <CardTitle>Ready   to test your knowledge</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This Quiz conatains 10 questions to your industry and skills .Take your time and choose the best answer for each question </p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={generateQuizFn}>Start Quiz</Button>
                </CardFooter>
            </Card>
            
          


        )
    }
    const question=quizData[currentQuestion];
  return (
    <Card  className="mx-2">
    <CardHeader>
        <CardTitle>Question {currentQuestion +1} of {quizData.length}</CardTitle> 
    </CardHeader>
    <CardContent className="space-y-4">
        <p className="text-muted-foreground">{question.question} </p>
        <RadioGroup className="space-y-2" onValueChange={handleAnswer} value={answers[currentQuestion]}>
            {question.options.map((option,i)=>{
                return (
                <div  key={i} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${i}`} />
                    <Label htmlFor={`option-${i}`} >{option}</Label>
                </div>
                )
            })}
            
        </RadioGroup>
        {showExplanation && 
        <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation</p>
            <p className="text-muted-foreground">{question.explanation}</p>

        </div>
            }
    </CardContent>
    <CardFooter>
        {!showExplanation && (
            <Button onClick={()=>setshowExplanation(true)} variant="outline" disabled={!answers[currentQuestion]}
            >Show Explanation</Button>
            
        )}
        <Button onClick={handleNext} className="ml-auto" disabled={!answers[currentQuestion]|| savingResult}>
            {savingResult && (
                <Loader2 className="mt-4" width={"100%"} color="gray"/>
            )}
            {currentQuestion<quizData.length-1 ? "Next Question"
             :  "Finish Quiz"}
        </Button>
    </CardFooter>
</Card>
  )
}

export default quiz