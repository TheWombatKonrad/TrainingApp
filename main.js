Vue.createApp({
  data() {
    return {
      readymades: [],
      exercises: [],
      userWorkout: [],
      workoutTimeLeft: '',
      workoutStopTime: 0,
      exerciseTimeLeft: 45,
      workoutActive: true
    }
  },

  watch: {
    //anytime userWorkout changes, this method runs and saves the
    //userWorkout to localStorage
    userWorkout: {
      handler() {
        localStorage.userWorkout = JSON.stringify(this.userWorkout);
      },
      deep: true,
    }
  },

  methods: {
    //adds the exercise to the userWorkout-array
    addExToUserWorkout(exercise) {
      //if there is already an exercise added, it adds a break first
      if (this.userWorkout.length > 0) {
        let temp = { name: "Break", length: 15 };

        this.userWorkout.push(temp);
      }

      this.userWorkout.push(exercise);
    },

    //adds the program to the userWorkout-array
    addProgramToUserWorkout(workout) {
      //makes sure the array is empty first
      this.userWorkout = [];

      for (item of workout) {
        //if there is already an exercise added, it adds a break first
        if (this.userWorkout.length > 0) {
          let temp = { name: "Break", length: 15 };

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
    clearUserWorkout() {
      this.userWorkout = [];

      this.stopWorkout();
    },

    async startWorkout() {
      document.getElementById('start').hidden = true;
      document.getElementById('next').hidden = false;

      this.workoutActive = true;
      let workout = document.querySelectorAll("#workout ul li");

      //removes the removeButton from the userProgram list items
      for (item of workout) {
        item.querySelector(".removeButton").hidden = true;
      }

      //calculates the stop time
      let timeToAdd = 0;

      for (item of this.userWorkout) {
        timeToAdd = timeToAdd + item.length;
      }

      let currentTime = new Date().getTime();
      this.workoutStopTime = currentTime + timeToAdd * 1000;

      //loops through all exercises
      await loopThroughExercises(workout);

      document.getElementById('start').hidden = false;
      document.getElementById('next').hidden = true;
      this.workoutTimeLeft = '';
    },//method

    async loopThroughExercises(workout) {
      for (item of workout) {
        if (this.workoutActive) {

          //sätter klassen aktiv och visar timern
          item.classList.add("active");
          item.querySelector(".exerciseTimer").hidden = false;

          if (item.querySelector('h3').textContent.includes('Break')) {
            timeToAdd = 15000;
          }

          else {
            timeToAdd = 45000;
          }

          //calculates how many seconds of the exercise are left
          let currentTime = new Date().getTime();
          let timeToAdd;
          let exerciseStopTime = currentTime + timeToAdd;
          this.exerciseTimeLeft = exerciseStopTime - currentTime;

          //will loop through the exercise until it reaches 0
          //each time calculating the amount of time left
          while (this.exerciseTimeLeft > 0) {
            this.exerciseTimeLeft = Math.round(
              ((exerciseStopTime - new Date().getTime()) / 1000));

            this.workoutTimeLeft = Math.round(
              (this.workoutStopTime - new Date().getTime()) / 1000);

            //must wait 1 sec
            await new Promise(resolve => setTimeout(resolve, 1000));
          }//while

          //removes active and hides the timer
          item.classList.remove("active");
          item.querySelector(".exerciseTimer").hidden = true;
        }//if
      }//for
    },//method

    nextExercise() {
      this.workoutStopTime = this.workoutStopTime - (this.exerciseTimeLeft * 1000);
      this.exerciseTimeLeft = 0;
    },

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

    startDragWorkout(evt, item) {
      evt.dataTransfer.dropEffect = "move"
      evt.dataTransfer.effectAllowed = "move"
      evt.dataTransfer.setData('itemID', item.id)
      evt.dataTransfer.setData('isList', false)
    },

    startDragProgram(evt, item) {
      evt.dataTransfer.dropEffect = "move"
      evt.dataTransfer.effectAllowed = "move"
      evt.dataTransfer.setData('itemID', item.id)
      evt.dataTransfer.setData('isList', true)
    },

    onDrop(evt) {
      const itemID = evt.dataTransfer.getData("itemID")
      const isList = evt.dataTransfer.getData('isList')

      if (isList === "true") {
        this.userWorkout = [];

        const list = this.readymades.find(list => list.id == itemID);

        for (item of list.content) {
          //if there is already an exercise added, it adds a break first
          if (this.userWorkout.length > 0) {
            let temp = { name: "Break", length: 15 };

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
