Vue.createApp({
  data() {
    return {
      readymades: [],
      exercises: [],
      programs: [],
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
    addToUserWorkout(exercise) {
      //if there is already an exercise added, it adds a break first
      if(this.userWorkout.length > 0){
        let temp = { name:"Break" };

        this.userWorkout.push(temp);
      }

      this.userWorkout.push(exercise);
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
          while (this.exerciseTimeLeft > 0) {
            while(this.workoutActive) {
            this.exerciseTimeLeft = Math.round(
              ((exerciseStopTime - new Date().getTime()) / 1000));

              this.workoutTimeLeft = Math.round(
                (workoutStopTime - new Date().getTime()) / 1000);

                //must wait 1 sec
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
              }//while

              //removes active and hides the timer
              item.classList.remove("active");
              item.querySelector(".exerciseTimer").hidden = true;

          }//for
        },//method

        async pauseWorkout() {
          this.workoutActive = false;
          document.getElementById('start').hidden = true;
          document.getElementById('unpause').hidden = false;

          await new Promise(resolve => {
            document.addEventListener("unpause", function() {
              this.workoutActive = true;
            });

            document.getElementById('unpause').hidden = true;
            document.getElementById('start').hidden = false;

          });

        },

        unPauseWorkout() {
          this.workoutActive = true;
          document.getElementById('unpause').hidden = true;
          document.getElementById('start').hidden = false;
        },

        stopWorkout() {
          this.timersEnabled = false
          this.workoutTimeLeft = 30

          let workout = document.querySelectorAll("#workout ul li");

          for (item of workout) {
            item.querySelector(".removeButton").hidden = false;
            item.querySelector(".exerciseTimer").hidden = true;
          }
        },

        dragStartHandler
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
