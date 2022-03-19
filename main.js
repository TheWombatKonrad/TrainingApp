Vue.createApp({
  data() {
    return {
      readymade: [],
      exercises: [],
      programs: [],
      userWorkout: [],
      workoutStopTime: '',
      workoutTimeLeft: '',
      exerciseTimeLeft: 45,
      timersEnabled: false

    }
  },

  methods: {
    //adds the exercise to the userWorkout-array
    addToUserWorkout(exercise) {
      if(this.userWorkout.length > 0){
        let break = new exercises();
        break.name = 'Break';

      }

      this.userWorkout.push(exercise);
    },

    //removes a specified exercise from the userWorkout-array
    removeExercise(exercise) {
      let index = this.userWorkout.indexOf(exercise);
      this.userWorkout.splice(index, 1);
    },

    //removes all exercises from the array
    clearProgram() {
      this.userWorkout = [];
    },

    async startWorkout() {
      //removes the removeButton from the userProgram list items, and shows
      let workout = document.querySelectorAll("#workout ul li");

      for (item of workout) {
        item.querySelector(".removeButton").hidden = true;
      }

      for (item of workout) {
        item.classList.add("active");
        item.querySelector(".exerciseTimer").hidden = false;

        let currentTime = new Date().getTime();
        let exerciseStopTime = currentTime + 45000;

        while (this.exerciseTimeLeft > 0) {
          this.exerciseTimeLeft = Math.round(
            ((exerciseStopTime - new Date().getTime()) / 1000));

          this.workoutTimeLeft = Math.round(
            (this.workoutStopTime - new Date().getTime()) / 1000);

          await new Promise(resolve => setTimeout(resolve, 1000));
        }//while
      }//for

        item.classList.remove("active");
        item.querySelector(".exerciseTimer").hidden = true;

        await new Promise(resolve => setTimeout(resolve, 15000));
    },

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
  }
}).mount("body");
