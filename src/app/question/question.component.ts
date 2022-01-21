import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  name : string ="";

  public questionList : any = [];
  public currentQuestion : number = 0;

  public points : number = 0;
  counter=60;

  correctAnswer : number = 0;
  IncorrectAnswer : number = 0;

  interval$ : any;

  progress : number = 0;

  isQuizCompleted : boolean = false;
  constructor( private service: ServiceService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name');
    this.getAllQuestions();
    this.startCounter();
  }


  getAllQuestions(){
     this.service.getQuestions().subscribe( res =>{
       console.log(res.questions);
       this.questionList = res.questions;
     })
  }


  nextQuestion(){
    this.currentQuestion++;
  }


  previousQuestion(){
    this.currentQuestion--;
  }


  answer(QuestionNumber : number , option : any){
    // ya if result kay leay he
    if(QuestionNumber == this.questionList.length){
       this.isQuizCompleted = true;
       this.stopCounter();
       
    }
    if(option.correct){
      this.points = this.points + 10;
      this.correctAnswer++;
      setTimeout(() =>{
        this.currentQuestion++;
      // this.resetCounter();
      this.getProgress();
      },1000)

    }else{

      this.points = this.points - 10;
      setTimeout(() =>{
        this.currentQuestion++;
        this.IncorrectAnswer--;
        // this.resetCounter();
        this.getProgress();
      },1000)
    }
  }



  startCounter(){
    this.interval$ = interval(1000).subscribe(res =>{
      this.counter--;
      if(this.counter == 0){
        this.currentQuestion++;
        this.counter= 60;
        this.points = -10;
      }
    });
    setTimeout(()=>{
      this.interval$.unsubcribe();
    },600000 );
  }


  stopCounter(){
    this.interval$.unsubscribe();
    this.counter = 0;
  }

  resetCounter(){
    this.startCounter();
    this.counter = 60;
    this.stopCounter();
  }


  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress = 0;
    
  }


  getProgress(){
    this.progress = (this.currentQuestion/this.questionList.length)*100;
    return this.progress;

  }

}
