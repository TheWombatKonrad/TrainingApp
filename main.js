Vue.createApp({
  data() {
    return {
      exercises: [],
      programs: [],
      userProgram: [],
      programTimerCount: '',
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
      this.userProgram.push(exercise);
    },

    removeExercise(exercise){
      let index = this.userProgram.indexOf(exercise);
      this.userProgram.splice(index, 1);
    },

    clearProgram(){
      this.userProgram = [];
    },

    startWorkout(){
      this.programTimerCount = this.userProgram.length * (45 + 15) - 15;
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
      let workout = document.querySelectorAll("#workout ul li");

      for(item of workout){
        item.classList.add("active");

        setTimeout(function () { item.classList.remove("active"); }, 5000);

      }
    }
  },


//run this code after the vue app has started
  mounted: async function(){
    let response = await fetch('exercises.json');
        let json = await response.json();
        this.exercises = json;
  }}).mount("body");
