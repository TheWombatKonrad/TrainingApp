Vue.createApp({
  data() {
    return {
      exercises: [],
      programs: [],
      userProgram: [],
      programTimerCount: 30,
      exerciseTimerCount: 45,
      timersEnabled: false
    }
},

watch: {

  timersEnabled(value) {
                if (value) {
                    setTimeout(() => {
                        this.programTimerCount--;
                    }, 1000);
                }
            },

  programTimerCount: {
  handler(value) {
    if (value > 0 && this.timersEnabled) {
      setTimeout(() => {
        this.programTimerCount--;
      }, 1000);
    }//if
  },//handler
  immediate: true
}//metod
},//watch

  methods: {
    addToUserProgram(exercise){
      exercise.isActive = false;
      exercise.isInActive = true;
      this.userProgram.push(exercise);
    },

    removeExercise(exercise){
      let index = this.userProgram.indexOf(exercise);
      this.userProgram.splice(index, 1);
    },

    clearProgram(userProgram){
      this.userProgram = [];
    },

    startWorkout(){
      this.timersEnabled = true

      let workout = document.querySelectorAll("#workout ul li");

      for(item of workout){
        item.querySelector(".removeButton").hidden = true;
        item.querySelector(".exerciseTimer").hidden = false;
      }

      this.cycleWorkouts();
    },

    pausWorkout(){
      this.timersEnabled = false
    },

    stopWorkout(){
      this.timersEnabled = false
      this.programTimerCount = 30

      let workout = document.querySelectorAll("#workout ul li");

      for(item of workout){
        item.querySelector(".removeButton").hidden = false;
        item.querySelector(".exerciseTimer").hidden = true;
      }
    },

    cycleWorkouts(){
      for(item of userProgram){
        item.IsActive = true;
        item.IsInActive = false;

        setTimeout(5000);

        item.IsActive = false;
        item.IsInactive = true;
      }
    }
  },


//run this code after the vue app has started
  mounted: async function(){
    let response = await fetch('exercises.json');
        let json = await response.json();
        this.exercises = json;
  }}).mount("body");
