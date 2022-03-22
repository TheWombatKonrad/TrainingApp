Vue.createApp({
  data() {
    return {
      readymades: [],
      exercises: [],
      programs: [],
      userWorkout: [],
      workoutTimeLeft: '',
      exerciseTimeLeft: 45,
      timersEnabled: false
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
      let workout = document.querySelectorAll("#workout ul li");

      //removes the removeButton from the userProgram list items
      for (item of workout) {
        item.querySelector(".removeButton").hidden = true;
      }

      //loopar igenom alla övningarna
      for (item of workout) {

        //sätter klassen aktiv och 
        item.classList.add("active");
        item.querySelector(".exerciseTimer").hidden = false;

        let timeToAdd;

        if(item.querySelector('h3').textContent.includes('Break')){
          timeToAdd = 15000;
        }

        else{
          timeToAdd = 45000;
        }

        let currentTime = new Date().getTime();

        let workoutStopTime = currentTime
        + (this.userWorkout.length * (45 + 15) - 15) * 1000;
        this.workoutTimeLeft = workoutStopTime - currentTime;

        let exerciseStopTime = currentTime + timeToAdd;
        this.exerciseTimeLeft = exerciseStopTime - currentTime;

        while (this.exerciseTimeLeft > 0) {
          this.exerciseTimeLeft = Math.round(
            ((exerciseStopTime - new Date().getTime()) / 1000));

            this.workoutTimeLeft = Math.round(
              (workoutStopTime - new Date().getTime()) / 1000);

              await new Promise(resolve => setTimeout(resolve, 1000));
            }//while

            item.classList.remove("active");
            item.querySelector(".exerciseTimer").hidden = true;
          }//for
        },//method

        pauseWorkout() {
          this.timersEnabled = false
        },

        stopWorkout() {
          this.timersEnabled = false
          this.workoutTimeLeft = 30

          let workout = document.querySelectorAll("#workout ul li");

          for (item of workout) {
            item.querySelector(".removeButton").hidden = false;
            item.querySelector(".exerciseTimer").hidden = true;
          }
        }
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
