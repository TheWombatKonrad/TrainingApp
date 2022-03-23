Vue.createApp({
data() {
  return {
    readymades: [],
    exercises: [],
    userWorkout: [],
    workoutTimeLeft: '',
    exerciseTimeLeft: 45,
    workoutActive: false
  }
},

watch: {
  //anytime userWorkout changes, this method runs, and addToUserWorkout
  //the userWorkout to localStorage
  userWorkout: {
    handler() {
      localStorage.userWorkout =  JSON.stringify(this.userWorkout);
    },
    deep: true,
  }
},

methods: {
  //adds the exercise to the userWorkout-array
  addExToUserWorkout(exercise) {
    //if there is already an exercise added, it adds a break first
    if(this.userWorkout.length > 0){
      let temp = { name:"Break" };

      this.userWorkout.push(temp);
    }

    this.userWorkout.push(exercise);
  },

  addProgramToUserWorkout(workout){
    this.userWorkout = [];

    for(item of workout){
      //if there is already an exercise added, it adds a break first
      if(this.userWorkout.length > 0){
        let temp = { name:"Break" };

        this.userWorkout.push(temp);
      }

      this.userWorkout.push(item);
    }
  },

  //removes a specified exercise from the userWorkout-array
  removeExercise(exercise, index) {
    this.userWorkout.splice(index, 1);
  },

  //removes all exercises from the array
  clearProgram() {
    this.userWorkout = [];
    this.exerciseTimeLeft = '';
  },

  async startWorkout() {
    this.workoutActive = true;

    let workout = document.querySelectorAll("#workout ul li");

    //gets the miliseconds from some date and calculates when the workout
    //will end (in miliseconds)
    let currentTime = new Date().getTime();
    let workoutStopTime = currentTime
    + (this.userWorkout.length * (45 + 15) - 15) * 1000;


    //removes the removeButton from the userProgram list items
    for (item of workout) {
      item.querySelector(".removeButton").hidden = true;
    }

    //loops through all exercises
    for (item of workout) {
      while(this.workoutActive) {

        //sätter klassen aktiv och visar timern
        item.classList.add("active");
        item.querySelector(".exerciseTimer").hidden = false;

        //the time the exercise or break will take
        let timeToAdd;

        if(item.querySelector('h3').textContent.includes('Break')){
          timeToAdd = 15000;
        }

        else{
          timeToAdd = 45000;
        }

        currentTime = new Date().getTime();

        //calculates when the exercise will end, and the difference between
        //that time and current time. same for workout
        this.workoutTimeLeft = workoutStopTime - currentTime;
        let exerciseStopTime = currentTime + timeToAdd;
        this.exerciseTimeLeft = exerciseStopTime - currentTime;

        //will loop through the exercise until it reaches 0
          while(this.exerciseTimeLeft > 0) {
          this.exerciseTimeLeft = Math.round(
            ((exerciseStopTime - new Date().getTime()) / 1000));

            this.workoutTimeLeft = Math.round(
              (workoutStopTime - new Date().getTime()) / 1000);

              //must wait 1 sec
              await new Promise(resolve => setTimeout(resolve, 1000));
            }

            //removes active and hides the timer
            item.classList.remove("active");
            item.querySelector(".exerciseTimer").hidden = true;
}//while
        }//for
      },//method

      stopWorkout() {
        this.workoutActive = false;
        this.exerciseTimeLeft = 0;
        this.workoutTimeLeft = '';

        let workout = document.querySelectorAll("#workout ul li");

        for (item of workout) {
          item.querySelector(".removeButton").hidden = false;
          item.querySelector(".exerciseTimer").hidden = true;
          item.classList.remove("active");
        }
      },
      startWorkoutDrag(evt, item){
        evt.dataTransfer.dropEffect = "move"
        evt.dataTransfer.effectAllowed = "move"
        evt.dataTransfer.setData('itemID', item.id)
        evt.dataTransfer.setData('isList', false)
      },

      startProgramDrag(evt, item){
        evt.dataTransfer.dropEffect = "move"
        evt.dataTransfer.effectAllowed = "move"
        evt.dataTransfer.setData('itemID', item.id)
        evt.dataTransfer.setData('isList', true)
      },

      onDrop(evt){
        const itemID = evt.dataTransfer.getData("itemID")
        const isList = evt.dataTransfer.getData('isList')

        if(isList === "true") {
          this.userWorkout = [];

          const list = this.readymades.find(list => list.id == itemID);

          for(item of list.content){
              //if there is already an exercise added, it adds a break first
              if(this.userWorkout.length > 0){
                let temp = { name:"Break" };

                this.userWorkout.push(temp);
              }

              this.userWorkout.push(item);
            }//for
        }//if

        else {
          const item = this.exercises.find(item => item.id == itemID)
          this.userWorkout.push(item);
        }
      }//method
    },


    //run this code after the vue app has started
    mounted: async function () {
      let response = await fetch('exercises.json');
      let json = await response.json();
      this.exercises = json;

      response = await fetch('readymade.json');
      json = await response.json();
      this.readymades = json;

      if (localStorage.userWorkout) {
        this.userWorkout = JSON.parse(localStorage.userWorkout);
      }
    }
  }).mount("body");
