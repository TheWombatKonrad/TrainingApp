Vue.createApp({
  data() {
    return {
      exercises: [],
      programs: [],
      userProgram: [],
    }
},

  methods: {
    addToUserProgram(exercise){
      this.userProgram.push(exercise);
    },

    removeExercise(exercise){
      let index = this.userProgram.indexOf(exercise);
      this.userProgram.splice(index, 1);
    }
  },

//run this code after the vue app has started
  mounted: async function(){
    let response = await fetch('exercises.json');
        let json = await response.json();
        this.exercises = json;
  }}).mount("body");
